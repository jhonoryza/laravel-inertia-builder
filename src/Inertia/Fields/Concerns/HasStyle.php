<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasStyle
{
    protected bool $isInline = false;

    protected ?string $mergeClass = null;

    protected array $columnSpan = ['default' => 1];

    protected array $columnOrder = [];

    public function inline(): static
    {
        $this->isInline = true;

        return $this;
    }

    public function mergeClass(string $class): static
    {
        $this->mergeClass = $class;

        return $this;
    }

    public function columnSpan(array $columnSpan): static
    {
        $this->columnSpan = $columnSpan;
        return $this;
    }

    public function columnOrder(array $columnOrder): static
    {
        $this->columnOrder = $columnOrder;
        return $this;
    }

    public function getIsInline(): bool
    {
        return $this->isInline;
    }

    public function getMergeClass(): ?string
    {
		return $this->mergeClass;        
    }

    public function getColumnSpan(): array
    {
		return $this->columnSpan;        
    }

    public function getColumnOrder(): array
    {
		return $this->columnOrder;        
    }
}