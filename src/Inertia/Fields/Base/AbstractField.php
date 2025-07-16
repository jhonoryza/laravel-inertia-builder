<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Base;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasReactive;
use JsonSerializable;

abstract class AbstractField implements JsonSerializable
{
    use HasReactive;

    public static function make(string $name): static
    {
        return new static($name);
    }

    public string $name;

    public string $label;

    public string $type;

    public ?string $placeholder = null;

    public bool $isInline = false;

    public ?string $mergeClass = null;

    public bool $isDisable = false;

    public bool $hidden = false;

    public \Closure|array|string|int|bool|null $defaultValue = null;

    public function __construct(string $name)
    {
        $this->name  = $name;
        $this->label = ucwords(str_replace('_', ' ', $name));
        $this->type  = static::getType();
    }

    abstract protected static function getType(): string;

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function defaultValue(array|string|bool|int|callable|null $value = null): static
    {
        $this->defaultValue = $value;

        return $this;
    }

    /**
     * Set the placeholder text for the field
     */
    public function placeholder(string $placeholder): static
    {
        $this->placeholder = $placeholder;

        return $this;
    }

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

    public function disable($state = true): static
    {
        $this->isDisable = $state;

        return $this;
    }

    public function hidden($state = true): static
    {
        $this->hidden = $state;

        return $this;
    }

    public function disableUsing(callable $func): static
    {
        $this->isDisable = $func();

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return [
            'name'         => $this->name,
            'label'        => $this->label,
            'type'         => $this->type,
            'placeholder'  => $this->placeholder,
            'isInline'     => $this->isInline,
            'mergeClass'   => $this->mergeClass,
            'isDisable'    => $this->isDisable,
            'hidden'       => $this->hidden,
            'reactive'     => $this->isReactive,
            'defaultValue' => is_callable($this->defaultValue) ?
                call_user_func($this->defaultValue)
                : $this->defaultValue,
        ];
    }

    /**
     * Specify data which should be serialized to JSON
     *
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
