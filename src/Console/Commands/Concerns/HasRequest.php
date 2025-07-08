<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasRequest
{
    protected function generateRequests($modelName, $schema): void
    {
        $this->generateRequest("{$modelName}StoreRequest", $schema);
        $this->generateRequest("{$modelName}UpdateRequest", $schema);
    }

    protected function generateRequest($requestName, $schema): void
    {
        $requestPath = app_path("Http/Requests/$requestName.php");
        if (File::exists($requestPath)) {
            $this->warn("Request $requestName already exists. Skipping.");

            return;
        }

        $stub  = File::get(base_path('stubs/inertia-builder/cms.request.stub'));
        $rules = $this->generateValidationRules($schema);

        $content = str_replace(
            ['{{className}}', '{{rules}}'],
            [$requestName, $rules],
            $stub
        );

        File::put($requestPath, $content);
        Process::run('./vendor/bin/pint ' . $requestPath);
        $this->info("Request $requestName created.");
    }

    protected function generateValidationRules($schema): string
    {
        return collect($schema)->map(function ($column) {
            $name = $column['name'];
            if (in_array($name, ['id', 'created_at', 'updated_at', 'deleted_at'])) {
                return;
            }

            $rules = $column['nullable'] ? ['nullable'] : ['required'];

            if (Str::endsWith($name, '_id')) {
                $tableName = Str::plural(Str::beforeLast($name, '_id'));
                array_push($rules, 'integer', "exists:$tableName,id");
            } else {
                $type = $column['type_name'];
                match ($type) {
                    'varchar' => array_push($rules, 'string', 'min:1', 'max:255'),
                    'text'    => array_push($rules, 'string', 'min:1'),
                    'float4', 'float8', 'numeric' => $rules[]      = 'numeric',
                    'int2', 'int4', 'int8' => $rules[]             = 'integer',
                    'bool' => $rules[]                             = 'boolean',
                    'date', 'timestamp', 'timestamptz' => $rules[] = 'date',
                    'jsonb' => $rules[]                            = 'array',
                    default => null,
                };
            }

            $ruleString = collect($rules)->map(fn ($r) => "'$r'")->implode(', ');

            return "'$name' => [$ruleString],";
        })->filter()->implode("\n");
    }
}
