<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasSearchable
{
    public bool|Closure $searchable = false;

    public function searchable(bool|callable $state = true): static
    {
        $this->searchable = $state;

        return $this;
    }

    public function getIsSearchable(): bool
    {
        return is_callable($this->searchable) ?
            $this->evaluate($this->searchable) : $this->searchable;
    }
}
