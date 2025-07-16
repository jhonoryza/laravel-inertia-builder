<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Options;

use JsonSerializable;

class Option implements JsonSerializable
{
    public function __construct(
        public string $label,
        public string|int|bool|null $value,
    ) {
        //
    }

    public static function make(string|int|bool|null $value): static
    {
        if (is_bool($value)) {
            $label = $value ? 'true' : 'false';
            $value = $value ? 'true' : 'false';
        } elseif (is_null($value)) {
            $label = 'null';
        } else {
            $label = str((string) $value)
                ->replace('-', ' ')
                ->replace('_', ' ')
                ->title();
        }

        return new static($label, $value);
    }

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'label' => $this->label,
            'value' => $this->value,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
