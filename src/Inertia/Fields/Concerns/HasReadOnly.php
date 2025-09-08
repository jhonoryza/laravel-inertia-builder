<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasReadOnly
{
    protected bool|Closure $isReadOnly = false;

    public function disable(bool|callable $state = true): static
    {
        $this->isReadOnly = $state;

        return $this;
    }

    public function evaluateDisable(): static
    {
        $this->isReadOnly = is_callable($this->isReadOnly) ?
            $this->evaluate($this->isReadOnly) : $this->isReadOnly;

        return $this;
    }

    public function disableUsing(callable $callable): static
    {
        $this->isReadOnly = $callable;

        return $this;
    }

    public function getIsDisable(): bool
    {
        return is_callable($this->isReadOnly) ?
            $this->evaluate($this->isReadOnly) : $this->isReadOnly;
    }
}
