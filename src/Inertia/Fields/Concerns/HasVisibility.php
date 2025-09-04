<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

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
        $this->evaluateHidden();

        return $this->hidden;
    }

    public function evaluateHidden(): static
    {
        // jika boolean, kembalikan langsung
        if (! is_callable($this->hidden)) {
            $this->hidden = (bool) $this->hidden;

            return $this;
        }

        $this->hidden = $this->evaluate($this->hidden, [
            'state' => $this->state,
            'model' => $this->form?->getModel(),
            'get'   => new Get($this),
        ]);

        return $this;
    }
}
