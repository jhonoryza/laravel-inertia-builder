<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasServerside
{
    protected bool|Closure $serverside = false;

    public function serverside(bool|callable $state = true): self
    {
        $this->serverside = $state;

        return $this;
    }

    public function getIsServerSide(): bool
    {
        return is_callable($this->serverside) ?
            $this->evaluate($this->serverside) : $this->serverside;
    }
}
