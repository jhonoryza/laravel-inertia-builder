<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Grids;

use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasColumns;
use JsonSerializable;

class Grid implements JsonSerializable
{
    use HasColumns;

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
            $this->fields[$index] = $field->grid()
                ->gridKey($this->key)
                ->gridCol($this->getColumns());
        }

        return $this->fields;
    }

    public function toArray(): array
    {
        return [
            'type'    => 'grid',
            'key'     => $this->key,
            'columns' => $this->getColumns(),
            'fields'  => $this->getSchema(),
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
