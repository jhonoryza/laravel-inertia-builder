<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

trait HasPrefix
{
    protected ?string $prefix = null;

    public function prefix($prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function getPrefix(): ?string
    {
        return is_callable($this->prefix) ?
            $this->evaluate($this->prefix, [
                'state' => $this->getState(),
                'model' => $this->form?->getModel(),
                'get' => new Get($this),
            ]) : $this->prefix;        
    }
}
