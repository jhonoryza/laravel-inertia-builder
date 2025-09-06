<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasCopyable
{
    protected bool|Closure $copyable = false;

    public function copyable(bool|callable $state = true): self
    {
        $this->copyable = $state;

        return $this;
    }

    public function getIsCopyable(): bool
    {
        return is_callable($this->copyable) ?
            $this->evaluate($this->copyable) : $this->copyable;
    }
}
