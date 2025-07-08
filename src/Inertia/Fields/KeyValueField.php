<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class KeyValueField extends AbstractField
{
    public bool $addable = true;

    public bool $editable = true;

    public bool $removable = true;

    public bool $reorderable = false;

    public ?string $keyLabel = null;

    public ?string $valueLabel = null;

    public ?string $addButtonLabel = null;

    public ?string $keyPlaceholder = null;

    public ?string $valuePlaceholder = null;

    protected static function getType(): string
    {
        return 'key-value';
    }

    /**
     * Enable/disable adding new key-value pairs
     */
    public function addable(bool $addable = true): static
    {
        $this->addable = $addable;

        return $this;
    }

    /**
     * Enable/disable editing existing key-value pairs
     */
    public function editable(bool $editable = true): static
    {
        $this->editable = $editable;

        return $this;
    }

    /**
     * Enable/disable removing key-value pairs
     */
    public function removable(bool $removable = true): static
    {
        $this->removable = $removable;

        return $this;
    }

    /**
     * Enable/disable reordering of key-value pairs
     */
    public function reorderable(bool $reorderable = true): static
    {
        $this->reorderable = $reorderable;

        return $this;
    }

    /**
     * Set label for the key column
     */
    public function keyLabel(string $label): static
    {
        $this->keyLabel = $label;

        return $this;
    }

    /**
     * Set label for the value column
     */
    public function valueLabel(string $label): static
    {
        $this->valueLabel = $label;

        return $this;
    }

    /**
     * Set label for the add button
     */
    public function addButtonLabel(string $label): static
    {
        $this->addButtonLabel = $label;

        return $this;
    }

    /**
     * Set placeholder for the key input
     */
    public function keyPlaceholder(string $placeholder): static
    {
        $this->keyPlaceholder = $placeholder;

        return $this;
    }

    /**
     * Set placeholder for the value input
     */
    public function valuePlaceholder(string $placeholder): static
    {
        $this->valuePlaceholder = $placeholder;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'addable'          => $this->addable,
            'editable'         => $this->editable,
            'removable'        => $this->removable,
            'reorderable'      => $this->reorderable,
            'keyLabel'         => $this->keyLabel         ?? 'Key',
            'valueLabel'       => $this->valueLabel       ?? 'Value',
            'addButtonLabel'   => $this->addButtonLabel   ?? 'Add Item',
            'keyPlaceholder'   => $this->keyPlaceholder   ?? 'Enter key',
            'valuePlaceholder' => $this->valuePlaceholder ?? 'Enter value',
        ]);
    }
}
