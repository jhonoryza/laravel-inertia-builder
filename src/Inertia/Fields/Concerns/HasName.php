<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasName
{
    protected string|Closure $name;

    public function name(string|callable $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getName(): string
    {
        return is_callable($this->name) ?
            $this->evaluate($this->name) : $this->name;
    }
}
