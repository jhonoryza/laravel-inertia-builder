<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasTab
{
    protected bool|Closure $hasTab = false;

    protected string|null|Closure $tabKey = null;

    public function tab(bool|callable $state = true): static
    {
        $this->hasTab = $state;

        return $this;
    }

    public function getIsTab(): bool
    {
        return is_callable($this->hasTab) ?
            $this->evaluate($this->hasTab) : $this->hasTab;
    }

    public function tabKey(string|null|callable $state): static
    {
        $this->tabKey = $state;

        return $this;
    }

    public function getTabKey(): ?string
    {
        return is_callable($this->tabKey) ?
            $this->evaluate($this->tabKey) : $this->tabKey;
    }
}
