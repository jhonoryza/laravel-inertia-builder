<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasSearchable
{
    public bool $searchable = false;

    public function searchable($state = true): static
    {
        $this->searchable = $state;

        return $this;
    }
}
