<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasModel
{
    protected function generateModel($modelName, $schema): void
    {
        $modelPath = app_path("Models/$modelName.php");
        if (File::exists($modelPath)) {
            $this->warn("Model $modelName already exists. Skipping.");
            return;
        }

        $stub = File::get(base_path('stubs/inertia-builder/cms.model.stub'));

        $hasSoftDeletes = collect($schema)->pluck('name')->contains('deleted_at');

        $content = str_replace(
            [
                '{{modelName}}',
                '{{fillable}}',
                '{{casts}}',
                '{{relationships}}',
                '{{softDeletes}}'
            ],
            [
                $modelName,
                $this->generateFillable($schema),
                $this->generateCasts($schema),
                $this->generateRelationships($schema),
                $hasSoftDeletes ? 'use SoftDeletes;' : '',
            ],
            $stub
        );

        File::put($modelPath, $content);
        Process::run('./vendor/bin/pint ' . $modelPath);
        $this->info("Model $modelName created from stub.");
    }

    private function generateFillable($schema): string
    {
        return collect($schema)->pluck('name')->filter(function ($name) {
            return !in_array($name, ['id', 'created_at', 'updated_at', 'deleted_at']);
        })->map(fn($name) => "        '$name',")->implode("\n");
    }

    private function generateCasts($schema): string
    {
        return collect($schema)->map(function ($column) {
            $name = $column['name'];
            $type = $column['type_name'];
            if (in_array($name, ['created_at', 'updated_at', 'deleted_at'])) {
                return null;
            }
            return match ($type) {
                'bool' => "'$name' => 'boolean',",
                'date' => "'$name' => 'date',",
                'timestamp', 'timestamptz' => "'$name' => 'datetime',",
                'jsonb' => "'$name' => 'array',",
                default => null,
            };
        })->filter()->implode("\n");
    }

    private function generateRelationships($schema): string
    {
        return collect($schema)->pluck('name')->filter(fn($name) => Str::endsWith($name, '_id'))
            ->map(function ($foreignKey) {
                $relationName = Str::beforeLast($foreignKey, '_id');
                $relatedModel = Str::studly($relationName);
                return "\n    public function $relationName(): BelongsTo\n    {\n
                        return \$this->belongsTo($relatedModel::class);\n
                }";
            })->implode("");
    }
}
