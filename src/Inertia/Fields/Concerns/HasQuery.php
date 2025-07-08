<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasQuery
{
    public ?\Closure $queryCallback = null;

    public function query(callable $query): static
    {
        $this->queryCallback = $query;

        return $this;
    }
}
