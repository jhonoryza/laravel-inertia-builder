<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasReactive
{
    protected bool $isReactive = false;

    /**
     * Mark this field as reactive.
     * Changing its value on the frontend will trigger a partial reload
     * to update the form's state from the server.
     */
    public function reactive(): self
    {
        $this->isReactive = true;

        return $this;
    }

    public function getIsReactive(): bool
    {
        return $this->isReactive;
    }
}
