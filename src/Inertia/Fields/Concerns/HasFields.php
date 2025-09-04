<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Grids\Grid;

trait HasFields
{
    protected array $fields = [];

    protected function normalizedSchema($fields): array
    {
        $normalized = [];

        foreach ($fields as $field) {
            if ($field instanceof Grid) {
                $normalized = array_merge($normalized, $field->getSchema());
            } else {
                $normalized[] = $field;
            }
        }

        return $normalized;
    }

    public function schema(array $fields): static
    {

        $this->fields = $this->normalizedSchema($fields);

        return $this;
    }

    public function fields(array $fields): static
    {
        $this->fields = $this->normalizedSchema($fields);

        return $this;
    }

    public function appendFieldToSchema(AbstractField|iterable $field): static
    {
        if ($field instanceof AbstractField) {
            $this->fields[] = $field;
        } else {
            foreach ($field as $f) {
                $this->fields[] = $f;
            }
        }

        return $this;
    }

    public function findField(string $name)
    {
        return collect($this->getFields())
            ->first(fn ($field) => $field->getName() === $name);
    }

    public function getSchema(): array
    {
        return $this->fields;
    }

    public function getFields(): array
    {
        return $this->fields;
    }
}
