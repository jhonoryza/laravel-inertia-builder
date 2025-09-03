<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasPlaceholder
{
    protected ?string $placeholder = null;

    public function placeholder(string $placeholder): static
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    public function getPlaceholder(): ?string
    {
        return $this->placeholder;
    }
}
