<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasColumns
{
    protected array $columns = [];

    public function columns(int|array $columns): static
    {
        if (is_int($columns)) {
            $this->columns = ['default' => $columns];

            return $this;
        }
        $this->columns = $columns;

        return $this;
    }

    public function getColumns(): array
    {
        return $this->columns;
    }
}
