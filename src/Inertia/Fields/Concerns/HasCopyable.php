<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasCopyable
{
    protected bool $copyable = false;

    public function copyable($state = true): self
    {
        $this->copyable = $state;

        return $this;
    }

    public function getCopyable(): bool
    {
        return $this->copyable;
    }
}
