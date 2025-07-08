<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class CustomField extends AbstractField
{
    public ?string $component = null;

    public array $extraAttributes = [];

    public mixed $state = null;

    public ?\Closure $formatStateUsing = null;

    protected static function getType(): string
    {
        return 'custom';
    }

    /**
     * Set a custom React component to render this field
     * check directory resources/js/components/custom-fields
     * Example: rating-field or color-picker-field
     */
    public function component(string $component): static
    {
        $this->component = $component;

        return $this;
    }

    /**
     * Set extra attributes to pass to the component or view
     */
    public function extraAttributes(array $attributes): static
    {
        $this->extraAttributes = array_merge($this->extraAttributes, $attributes);

        return $this;
    }

    /**
     * Set a single extra attribute
     */
    public function extraAttribute(string $key, mixed $value): static
    {
        $this->extraAttributes[$key] = $value;

        return $this;
    }

    /**
     * Set the initial state for the field
     */
    public function state(mixed $state): static
    {
        $this->state = $state;

        return $this;
    }

    /**
     * Format the state before it's displayed
     */
    public function formatStateUsing(\Closure $callback): static
    {
        $this->formatStateUsing = $callback;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        $data = parent::toArray();

        $state = $this->state;

        if ($this->formatStateUsing && is_callable($this->formatStateUsing)) {
            $state = call_user_func($this->formatStateUsing, $state);
        }

        return array_merge($data, [
            'component'       => $this->component,
            'extraAttributes' => $this->extraAttributes,
            'state'           => $state,
        ]);
    }
}
