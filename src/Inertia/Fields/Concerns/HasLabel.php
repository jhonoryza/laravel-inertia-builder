<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasLabel
{
    protected string $label;

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->label;
    }
}
