<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

trait HasPrefix
{
    protected string|Closure $prefix = null;

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
