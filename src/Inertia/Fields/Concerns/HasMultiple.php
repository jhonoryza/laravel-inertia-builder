<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasMultiple
{
    public bool|Closure $multiple = false;

    public function multiple(): static
    {
        $this->multiple = true;

        return $this;
    }

    public function getIsMultiple(): bool
    {
        return is_callable($this->multiple) ?
            $this->evaluate($this->multiple) : $this->multiple;
    }
}
