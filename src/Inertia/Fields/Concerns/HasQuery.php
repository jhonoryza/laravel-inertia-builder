<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait HasQuery
{
    public \Closure | null $queryCallback = null;

    public function query(callable $query): static
    {
        $this->queryCallback = $query;
        return $this;
    }
}
