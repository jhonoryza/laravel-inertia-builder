<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasFactory
{
    protected function generateFactory($modelName, $schema): void
    {
        $factoryPath = database_path("factories/{$modelName}Factory.php");
        if (File::exists($factoryPath)) {
            $this->warn("Factory {$modelName}Factory already exists. Skipping.");
            return;
        }

        $stub = File::get(base_path('stubs/inertia-builder/cms.factory.stub'));

        $content = str_replace(
            [
                '{{modelName}}',
                '{{definitions}}',
            ],
            [
                $modelName,
                $this->generateFactoryDefinitions($schema),
            ],
            $stub
        );

        File::put($factoryPath, $content);
        Process::run('./vendor/bin/pint ' . $factoryPath);
        $this->info("Factory {$modelName}Factory created from stub.");
    }

    private function generateFactoryDefinitions($schema): string
    {
        return collect($schema)->map(function ($column) {
            $name = $column['name'];
            if (in_array($name, ['id', 'created_at', 'updated_at', 'deleted_at'])) {
                return null;
            }

            if (Str::endsWith($name, '_id')) {
                $relatedModel = 'App\\Models\\' . Str::studly(Str::beforeLast($name, '_id'));
                return "'$name' => $relatedModel::factory(),";
            }

            $type = $column['type_name'];
            $faker = match (true) {
                $name === 'email' => '$this->faker->unique()->safeEmail()',
                $name === 'name' || $name === 'full_name' => '$this->faker->name()',
                $name === 'title' => '$this->faker->sentence()',
                $name === 'description' => '$this->faker->paragraph()',
                $name === 'content' || $name === 'body' => '$this->faker->paragraphs(3, true)',
                $name === 'city' => '$this->faker->city()',
                $name === 'country' => '$this->faker->country()',
                $name === 'address' => '$this->faker->address()',
                $name === 'phone_number' => '$this->faker->phoneNumber()',
                $name === 'password' => 'bcrypt("password")',
                $type === 'bool' || $type === 'boolean' => '$this->faker->boolean()',
                $type === 'date' => '$this->faker->date()',
                $type === 'timestamptz' || $type === 'timestamp' => '$this->faker->dateTime()',
                in_array($type, ['int2', 'int4', 'int8']) => '$this->faker->randomNumber()',
                default => '$this->faker->word()',
            };

            return "            '$name' => $faker,";
        })->filter()->implode("\n");
    }
}
