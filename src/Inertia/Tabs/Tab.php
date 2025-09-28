<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tabs;

use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use JsonSerializable;

class Tab implements JsonSerializable
{
    protected array $fields = [];

    protected ?string $key = null;

    public function __construct(string $key)
    {
        $this->key = $key;
    }

    public static function make(?string $key = null): static
    {
        if ($key == null) {
            $key = Str::ulid();
        }

        return new static($key);
    }

    public function schema(array $fields): static
    {
        $this->fields = $fields;

        return $this;
    }

    public function getSchema(): array
    {
        foreach ($this->fields as $index => $field) {
            /** @var AbstractField $field */
            $this->fields[$index] = $field
                ->tab()
                ->tabKey($this->key)
                ->key($this->key . '_' . $field->getKey());
        }

        return $this->fields;
    }

    public function toArray(): array
    {
        return [
            'type'   => 'tab',
            'key'    => $this->key,
            'fields' => $this->getSchema(),
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
