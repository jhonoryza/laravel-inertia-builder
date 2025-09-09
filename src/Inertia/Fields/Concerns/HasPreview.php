<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasPreview
{
    public string|null|Closure $preview = null;

    public function preview(string|callable $preview): static
    {
        $this->preview = $preview;

        return $this;
    }

    public function getPreview(): ?string
    {
        return is_callable($this->preview) ?
            $this->evaluate($this->preview) : $this->preview;
    }
}
