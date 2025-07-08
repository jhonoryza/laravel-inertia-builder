<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasMultiple
{
    public bool $multiple = false;

    public function multiple(): static
    {
        $this->multiple = true;

        return $this;
    }
}
