<?php

namespace Jhonoryza\InertiaBuilder\Inertia;

use JsonSerializable;

class Form implements JsonSerializable
{
    private array $columns = [];
    private array $fields = [];

    public static function make(): static
    {
        return new static();
    }

    public function columns(int|array $columns): self
    {
        if (is_int($columns)) {
            $this->columns = ['default' => $columns];
            return $this;
        }
        $this->columns = $columns;
        return $this;
    }

    public function fields(array $fields): self
    {
        $this->fields = $fields;
        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'columns' => $this->columns,
            'fields' => $this->fields,
        ];
    }
}