<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

trait HasSuffix
{
    protected ?string $suffix = null;

    public function suffix($suffix): static
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function getSuffix(): ?string
    {
        return is_callable($this->suffix) ?
            $this->evaluate($this->suffix, [
                'state' => $this->getState(),
                'model' => $this->form?->getModel(),
                'get' => new Get($this),
            ]) : $this->suffix;
    }
}
