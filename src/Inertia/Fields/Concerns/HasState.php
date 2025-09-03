<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Set;

trait HasState
{
    public \Closure|array|string|int|bool|null $state = null;

    protected ?\Closure $afterStateUpdated = null;

    protected ?\Closure $formatStateUsing = null;

    public function state(array|string|bool|int|callable|null $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function defaultValue(array|string|bool|int|callable|null $value = null): static
    {
        $this->state = $value;

        return $this;
    }

    public function evaluateState(): static
    {
        if ($this->formatStateUsing) {
            $this->state = $this->evaluate($this->formatStateUsing, [
                'state' => $this->state,
                'get'   => new Get($this),
                'model' => $this->form?->getModel(),
            ]);
            return $this;
        }

        $this->state = is_callable($this->state) ?
            $this->evaluate($this->state, [
                'state' => $this->state,
                'get'   => new Get($this),
                'model' => $this->form?->getModel(),
            ]) : $this->state;

        return $this;
    }

    public function getState()
    {
        $this->evaluateState();

        return $this->state;
    }

    public function formatStateUsing(callable $callable): static
    {
        $this->formatStateUsing = $callable;

        return $this;
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
                'get'   => new Get($this),
                'model' => $this->form?->getModel(),
            ]);
        }
    }
}
