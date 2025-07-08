<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class RepeaterField extends AbstractField
{
    public array $schema = [];

    public ?int $minItems = null;

    public ?int $maxItems = null;

    public ?string $addButtonLabel = null;

    public ?string $itemLabel = null;

    public bool $collapsible = false;

    public bool $collapsed = false;

    public bool $reorderable = false;

    protected static function getType(): string
    {
        return 'repeater';
    }

    /**
     * Set the schema for each repeater item
     *
     * @param  array  $schema  Array of field definitions
     */
    public function schema(array $schema): static
    {
        $this->schema = $schema;

        return $this;
    }

    /**
     * Set minimum number of items
     */
    public function minItems(int $count): static
    {
        $this->minItems = $count;

        return $this;
    }

    /**
     * Set maximum number of items
     */
    public function maxItems(int $count): static
    {
        $this->maxItems = $count;

        return $this;
    }

    /**
     * Set the label for the add button
     */
    public function addButtonLabel(string $label): static
    {
        $this->addButtonLabel = $label;

        return $this;
    }

    /**
     * Set the label format for each item
     * Can include placeholders like :index or field names with {field_name}
     * Example: Section :index - {title}
     */
    public function itemLabel(string $label): static
    {
        $this->itemLabel = $label;

        return $this;
    }

    /**
     * Make the repeater items collapsible
     */
    public function collapsible(bool $collapsible = true): static
    {
        $this->collapsible = $collapsible;

        return $this;
    }

    /**
     * Set whether items should be collapsed by default
     */
    public function collapsed(bool $collapsed = true): static
    {
        $this->collapsed = $collapsed;

        return $this;
    }

    /**
     * Allow items to be reordered
     */
    public function reorderable(bool $reorderable = true): static
    {
        $this->reorderable = $reorderable;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'schema'         => $this->schema,
            'minItems'       => $this->minItems,
            'maxItems'       => $this->maxItems,
            'addButtonLabel' => $this->addButtonLabel ?? 'Add Item',
            'itemLabel'      => $this->itemLabel      ?? 'Item :index',
            'collapsible'    => $this->collapsible,
            'collapsed'      => $this->collapsed,
            'reorderable'    => $this->reorderable,
        ]);
    }
}
