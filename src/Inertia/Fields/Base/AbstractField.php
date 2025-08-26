<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Base;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasDebounce;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasForm;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasKey;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasLabel;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasName;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasPlaceholder;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasReactive;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasReadOnly;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasState;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasStyle;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasType;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasVisibility;
use JsonSerializable;

abstract class AbstractField implements JsonSerializable
{
    use HasReactive, HasState, HasKey;
    use HasVisibility, HasDebounce, HasPlaceholder, HasReadOnly, HasStyle;
    use HasForm, HasLabel, HasName, HasType;

    abstract protected static function getType(): string;

    public function __construct(string $name)
    {
        $this->name($name);
        $this->key($name);
        $this->label(ucwords(str_replace('_', ' ', $name)));
        $this->type(static::getType());
    }

    public static function make(string $name): static
    {
        return new static($name);
    }

    protected function evaluate(mixed $value, array $parameters = [])
    {
        if (! $value instanceof \Closure) {
            return $value;
        }

        $reflector = new \ReflectionFunction($value);
        $args = [];

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

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return [
            'name'         => $this->getName(),
            'key'          => $this->getKey(),
            'type'         => $this->getType(),
            'label'        => $this->getLabel(),
            'placeholder'  => $this->getPlaceholder(),
            'isInline'     => $this->getIsInline(),
            'mergeClass'   => $this->getMergeClass(),
            'isDisable'    => $this->getIsDisable(),
            'hidden'       => $this->getHidden(),
            'reactive'     => $this->getIsReactive(),
            'defaultValue' => $this->getState(),
            'columnSpan'   => $this->getColumnSpan(),
            'columnOrder'  => $this->getColumnOrder(),
            'debounce'     => $this->getDebounce(),
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
