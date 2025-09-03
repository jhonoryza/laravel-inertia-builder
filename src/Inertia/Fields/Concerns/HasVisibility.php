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

        // cek apakah callback menerima parameter
        $reflection = new \ReflectionFunction($this->hidden);
        if ($reflection->getNumberOfParameters() === 0) {
            $this->hidden = $this->evaluate($this->hidden, [
                'get'   => new Get($this),
                'model' => $this->form?->getModel(),
            ]);

            return $this;
        }

        // jika menerima parameter, inject Get
        $this->hidden = $this->evaluate($this->hidden, [
            'get'   => new Get($this),
            'model' => $this->form?->getModel(),
        ]);

        return $this;
    }
}
