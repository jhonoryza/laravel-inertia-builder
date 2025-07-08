<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use JsonSerializable;

class Operator implements JsonSerializable
{
    public function __construct(
        private readonly string $label,
        private readonly string $value,
    )
    {
        //
    }

    protected static function make(string $label, string $value): static
    {
        return new static($label, $value);
    }

    public static function equals(): static
    {
        return self::make('equals', '=');
    }

    public static function notEquals(): static
    {
        return self::make('does not equal', '!=');
    }

    public static function in(): static
    {
        return self::make('is in', 'in');
    }

    public static function notIn(): static
    {
        return self::make('is not in', 'notIn');
    }

    public static function less(): static
    {
        return self::make('is less than', '<');
    }

    public static function lessAndEqual(): static
    {
        return self::make('is less than or equal to', '<=');
    }

    public static function between(): static
    {
        return self::make('is between', '><');
    }

    public static function notBetween(): static
    {
        return self::make('is not between', '!><');
    }

    public static function greater(): static
    {
        return self::make('is greater than', '>');
    }

    public static function greaterAndEqual(): static
    {
        return self::make('is greater than or equal to', '>=');
    }

    public static function contains(): static
    {
        return self::make('contains', '*');
    }

    public static function notContains(): static
    {
        return self::make('does not contains', '!*');
    }

    public static function startsWith(): static
    {
        return self::make('starts with', '=*');
    }

    public static function notStartsWith(): static
    {
        return self::make('does not starts with', '!=*');
    }

    public static function endsWith(): static
    {
        return self::make('ends with', '*=');
    }

    public static function notEndsWith(): static
    {
        return self::make('does not ends with', '!*=');
    }

    public static function isSet(): static
    {
        return self::make('is set', 'isNull');
    }

    public static function isNotSet(): static
    {
        return self::make('is not set', 'isNotNull');
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
