<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasDebounce
{
    protected int|Closure $debounce = 300;

    public function debounce(int|callable $miliSecond): static
    {
        $this->debounce = $miliSecond;

        return $this;
    }

    public function getDebounce(): int
    {
        return is_callable($this->debounce) ?
            $this->evaluate($this->debounce) : $this->debounce;
    }
}
