<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasPrefix
{
    protected string|Closure|null $prefix = null;

    public function prefix(string|callable $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function getPrefix(): ?string
    {
        return is_callable($this->prefix) ?
            $this->evaluate($this->prefix) : $this->prefix;
    }
}
