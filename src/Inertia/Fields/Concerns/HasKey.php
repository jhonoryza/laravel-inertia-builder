<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasKey
{
    protected string|Closure $key;

    public function key(string|callable $key): static
    {
        $this->key = $key;

        return $this;
    }

    public function getKey(): string
    {
        return is_callable($this->key) ?
            $this->evaluate($this->key) : $this->key;
    }
}
