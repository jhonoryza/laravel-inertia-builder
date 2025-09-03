<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base;

use JsonSerializable;

abstract class AbstractFilter implements JsonSerializable
{
    public string $field;

    public string $label;

    public string $type;

    public array $operators;

    abstract protected static function getType(): string;

    abstract protected function getOperators(): array;

    public static function make(string $field): static
    {
        return new static($field);
    }

    protected function evaluate(mixed $value, array $parameters = [])
    {
        if (! $value instanceof \Closure) {
            return $value;
        }

        $reflector = new \ReflectionFunction($value);
        $args      = [];

        foreach ($reflector->getParameters() as $param) {
            $type = $param->getType()?->getName();
            $name = $param->getName();

            // Inject berdasarkan nama
            if (array_key_exists($name, $parameters)) {
                $args[] = $parameters[$name];

                continue;
            }

            // Inject berdasarkan type-hint
            if ($type && array_key_exists($type, $parameters)) {
                $args[] = $parameters[$type];

                continue;
            }

            // Kalau nggak ketemu, coba default value
            if ($param->isDefaultValueAvailable()) {
                $args[] = $param->getDefaultValue();

                continue;
            }

            // fallback null
            $args[] = null;
        }

        return $value(...$args);
    }

    public function __construct(string $field)
    {
        $this->field     = $field;
        $this->label     = ucwords(str_replace('_', ' ', $field));
        $this->type      = static::getType();
        $this->operators = $this->getOperators();
    }

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function operators(array $operators = []): static
    {
        $this->operators = $operators;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return [
            'field'     => $this->field,
            'label'     => $this->label,
            'type'      => $this->type,
            'operators' => $this->operators,
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
