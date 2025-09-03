<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasController
{
    protected function generateTable($tableName, $modelName, $schema): void
    {
        $className = "{$modelName}Table";
        $classPath = app_path("Builder/Tables/$className.php");
        Process::run('mkdir -p app/Builder/Tables');

        if (File::exists($classPath)) {
            $this->warn("Table $className already exists. Skipping.");

            return;
        }

        $stub = File::get(base_path('stubs/inertia-builder/cms.table.stub'));

        $content = str_replace(
            [
                '{{modelName}}',
                '{{routeName}}',
                '{{columns}}',
                '{{filters}}',
            ],
            [
                $modelName,
                $tableName,
                $this->generateTableColumns($schema),
                $this->generateTableFilters($schema),
            ],
            $stub
        );

        $import = collect($schema)->map(function ($column) {
            if ($column['relationName']) {
                $relatedModel = Str::studly($column['relationName']);

                return 'use App\\Models\\' . $relatedModel . ';';
            }
        })->filter(fn ($item) => ! is_null($item));
        $content = str_replace('{{importsRelation}}', $import->implode(PHP_EOL), $content);

        File::put($classPath, $content);
        Process::run('./vendor/bin/pint ' . $classPath);
        $this->info("Table $className created.");
    }

    protected function generateForm($modelName, $schema): void
    {
        $className = "{$modelName}Form";
        $classPath = app_path("Builder/Forms/$className.php");
        Process::run('mkdir -p app/Builder/Forms');

        if (File::exists($classPath)) {
            $this->warn("Form $className already exists. Skipping.");

            return;
        }

        $stub = File::get(base_path('stubs/inertia-builder/cms.form.stub'));

        $content = str_replace(
            [
                '{{modelName}}',
                '{{fields}}',
            ],
            [
                $modelName,
                $this->generateFormFields($schema),
            ],
            $stub
        );

        $import = collect($schema)->map(function ($column) {
            if ($column['relationName']) {
                $relatedModel = Str::studly($column['relationName']);

                return 'use App\\Models\\' . $relatedModel . ';';
            }
        })->filter(fn ($item) => ! is_null($item));
        $content = str_replace('{{importsRelation}}', $import->implode(PHP_EOL), $content);

        File::put($classPath, $content);
        Process::run('./vendor/bin/pint ' . $classPath);
        $this->info("Form $className created.");
    }

    protected function generateController($tableName, $modelName, $schema): void
    {
        $controllerName = "{$modelName}Controller";
        $controllerPath = app_path("Http/Controllers/$controllerName.php");

        if (File::exists($controllerPath)) {
            $this->warn("Controller $controllerName already exists. Skipping.");

            return;
        }

        $stub = File::get(base_path('stubs/inertia-builder/cms.controller.stub'));

        $importTableClass = 'use App\\Builder\\Tables\\' . $modelName . 'Table;';
        $importFormClass  = 'use App\\Builder\\Forms\\' . $modelName . 'Form;';

        $content = str_replace(
            [
                '{{className}}',
                '{{modelName}}',
                '{{routeName}}',
                '{{importTableClass}}',
                '{{importFormClass}}',
                '{{TableClass}}',
                '{{FormClass}}',
                '{{modelVariable}}',
            ],
            [
                $controllerName,
                $modelName,
                $tableName,
                $importTableClass,
                $importFormClass,
                $modelName . 'Table',
                $modelName . 'Form',
                Str::camel($modelName),
            ],
            $stub
        );

        $import = collect($schema)->map(function ($column) {
            if ($column['relationName']) {
                $relatedModel = Str::studly($column['relationName']);

                return 'use App\\Models\\' . $relatedModel . ';';
            }

        })->filter(fn ($item) => ! is_null($item));
        $content = str_replace('{{importsRelation}}', $import->implode(PHP_EOL), $content);

        File::put($controllerPath, $content);
        Process::run('./vendor/bin/pint ' . $controllerPath);
        $this->info("Controller $controllerName created.");
    }

    protected function generateTableColumns($schema): string
    {
        return collect($schema)->map(function ($column) {
            $name = $column['name'];
            $type = $column['type_name'];
            $line = "TableColumn::make('$name')" . PHP_EOL;
            if ($column['relationName']) {
                $relationName = $column['relationName'];
                $relationKey  = $column['relationKey'];
                $line         = "TableColumn::make('$relationName.$relationKey')
                    ->label('" . Str::studly($relationName) . "')" . PHP_EOL;
            }
            if (in_array($type, ['varchar', 'text'])) {
                $line .= '->searchable()' . PHP_EOL;
            }
            if (in_array($type, ['timestamp', 'timestamptz'])) {
                $line .= "->renderUsing(function (\$value) {
                        return \$value
                            ?->format('d/m/Y H:i') ?? '';
                    })" . PHP_EOL;
            }
            if ($type == 'date') {
                $line .= "->renderUsing(function (\$value) {
                        return \$value
                            ?->format('d/m/Y') ?? '';
                    })" . PHP_EOL;
            }
            if ($type == 'bool') {
                $line .= "->renderUsing(function (\$value) {
                        return \$value ? 'Yes' : 'No';
                    })" . PHP_EOL;
            }
            if ($name === 'deleted_at') {
                $line .= '->hidden()' . PHP_EOL;
            }
            $line .= '->sortable(),';

            return $line;
        })->implode("\n");
    }

    protected function generateTableFilters($schema): string
    {
        return collect($schema)->map(function ($column) {
            $name = $column['name'];
            $type = $column['type_name'];

            if (in_array($name, ['id', 'created_at', 'updated_at', 'deleted_at'])) {
                return;
            }

            if ($column['relationName']) {
                $relationName = $column['relationName'];
                $relationKey  = $column['relationKey'];
                $relatedModel = Str::studly($relationName);

                return "Filter::select('$name')
                    ->label('" . Str::studly($relationName) . "')
                    ->relationship($relatedModel::class, '$relationKey', '$relationKey')
                    ->query(fn(\$query, \$op, \$val) => \$query->whereHas('$relationName', function (\$q) use (\$op, \$val) {
                        \$q->where('$relationKey', \$op, \$val);
                    })),";
            }

            return match ($type) {
                'varchar', 'text' => "Filter::text('$name'),",
                'int2', 'int4', 'int8' => "Filter::number('$name'),",
                'date', 'timestamptz', 'timestamp' => "Filter::date('$name'),",
                'bool'  => "Filter::boolean('$name'),",
                default => null,
            };
        })->filter()->implode("\n");
    }

    protected function generateFormFields($schema): string
    {
        return collect($schema)->map(function ($column) {
            $name = $column['name'];
            if (in_array($name, ['id', 'created_at', 'updated_at', 'deleted_at'])) {
                return;
            }

            if ($column['relationName']) {
                $relationName = $column['relationName'];
                $relationKey  = $column['relationKey'];
                $relatedModel = Str::studly($relationName);
                $field        = "Field::select('$name')
                    ->label('" . Str::studly($relationName) . "')
                    ->relationship($relatedModel::class, '$relationKey')";
            } else {
                $type  = $column['type_name'];
                $field = match ($type) {
                    'text' => "Field::textarea('$name')",
                    'int2', 'int4', 'int8' => "Field::number('$name')",
                    'bool' => "Field::toggle('$name')",
                    'date' => "Field::flatpickr('$name')->date()",
                    'timestamptz', 'timestamp' => "Field::flatpickr('$name')",
                    default => "Field::text('$name')",
                };
            }

            return "$field,";
        })->filter()->implode("\n");
    }
}
