<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasReactive
{
    protected bool|Closure $isReactive = false;

    /**
     * Mark this field as reactive.
     * Changing its value on the frontend will trigger a partial reload
     * to update the form's state from the server.
     */
    public function reactive(bool|callable $state = true): self
    {
        $this->isReactive = $state;

        return $this;
    }

    public function getIsReactive(): bool
    {
        return is_callable($this->isReactive) ?
            $this->evaluate($this->isReactive) : $this->isReactive;
    }
}
