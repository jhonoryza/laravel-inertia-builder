<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands;

use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasAppSidebar;
use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasController;
use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasFactory;
use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasModel;
use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasRequest;
use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasRoute;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use function Laravel\Prompts\text;

class GenerateCommand extends Command
{
    use HasModel, HasFactory, HasRequest, HasController, HasRoute;
    use HasAppSidebar;

    protected $signature = 'cms:generate {tableName}';
    protected $description = 'Generate boilerplate for a given table';

    public function handle(): int
    {
        $tableName = $this->argument('tableName');
        $modelName = Str::studly(Str::singular($tableName));

        $this->info("Generating for table: $tableName");

        if (!Schema::hasTable($tableName)) {
            $this->error("Table '$tableName' does not exist.");
            return 1;
        }

        $schema = Schema::getColumns($tableName);

        $schema = collect($schema)->map(function ($schema) use ($tableName) {
            $name = $schema['name'];
            $type = $schema['type_name'];
            if (Str::endsWith($name, '_id')) {
                $relationName = Str::beforeLast($name, '_id');
                $titleAttr = text(
                    label: 'possibly ' . Str::singular($tableName) . ' belongsTo ' . $relationName . ', which attribute want to display ?',
                    placeholder: 'example: name',
                    required: true
                );
                return [
                    'name' => $name,
                    'type_name' => $type,
                    'relationName' => $relationName,
                    'relationKey' => $titleAttr,
                    'nullable' => $schema['nullable'],
                ];
            }
            return [
                'name' => $name,
                'type_name' => $type,
                'relationName' => null,
                'relationKey' => null,
                'nullable' => $schema['nullable'],
            ];
        })->toArray();

        $this->generateModel($modelName, $schema);
        $this->generateFactory($modelName, $schema);
        $this->generateRequests($modelName, $schema);
        $this->generateController($tableName, $modelName, $schema);
        $this->addRoutes($tableName, $modelName);
        $this->addAppSidebar($tableName, $modelName);

        $this->info("$modelName generated successfully!");
        $this->warn("Please review the generated files, especially for relationships and complex field types.");
        return 0;
    }
}
