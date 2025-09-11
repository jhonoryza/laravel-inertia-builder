<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Forms\Set;

trait HasState
{
    public \Closure|array|string|int|bool|null $state = null;

    protected ?\Closure $afterStateUpdated = null;

    public function state(array|string|bool|int|callable|null $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getState()
    {
        $this->state = is_callable($this->state) ?
            $this->evaluate($this->state) : $this->state;

        return $this->state;
    }

    public function hasStateCallback(): bool
    {
        return is_callable($this->state);
    }

    public function hasAfterStateUpdated(): bool
    {
        return $this->afterStateUpdated != null;
    }

    public function afterStateUpdated(callable $state): static
    {
        $this->afterStateUpdated = $state;

        return $this;
    }

    public function triggerAfterStateUpdated($state, array &$formState): void
    {
        if ($this->afterStateUpdated) {
            $set = new Set($this, $formState);
            $this->evaluate($this->afterStateUpdated, [
                'state' => $state,
                'set'   => $set,
            ]);
        }
    }
}
