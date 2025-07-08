<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasOptions
{
    public array $options = [];

    public function options(array $options): static
    {
        $this->options = $options;

        return $this;
    }

    public function loadOptionsUsing(callable $callback): static
    {
        $this->options = $callback();

        return $this;
    }
}
