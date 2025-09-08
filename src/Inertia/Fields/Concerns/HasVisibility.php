<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasVisibility
{
    public \Closure|bool $hidden = false;

    public function hidden(bool|callable $state = true): static
    {
        $this->hidden = $state;

        return $this;
    }

    public function getHidden(): bool
    {
        return is_callable($this->hidden) ?
            $this->evaluate($this->hidden) : $this->hidden;
    }

    public function evaluateHidden(): static
    {
        $this->hidden = $this->getHidden();

        return $this;
    }
}
