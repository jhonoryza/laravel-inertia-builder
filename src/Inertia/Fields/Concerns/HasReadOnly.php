<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

trait HasReadOnly
{
    protected bool $isReadOnly = false;

    public function disable(bool|callable $state = true): static
    {
        $this->isReadOnly = $state;

        return $this;
    }

    public function evaluateDisable(): static
    {
        $this->isReadOnly = is_callable($this->isReadOnly) ?
            $this->evaluate($this->isReadOnly, [
                'state' => $this->state,
                'model' => $this->form?->getModel(),
                'get'   => new Get($this),
            ]) : $this->isReadOnly;

        return $this;
    }

    public function disableUsing(callable $callable): static
    {
        $this->isReadOnly = $callable;

        return $this;
    }

    public function getIsDisable(): bool
    {
        return $this->isReadOnly;
    }
}
