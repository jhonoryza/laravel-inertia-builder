<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tabs;

use Illuminate\Support\Str;
use JsonSerializable;

class Tabs implements JsonSerializable
{
    protected array $tabs = [];

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

    public function tabs(array $tabs): static
    {
        $this->tabs = $tabs;

        return $this;
    }

    public function getTabs(): array
    {
        return $this->tabs;
    }

    public function getSchema(): array
    {
        $normalized = [];
        foreach ($this->getTabs() as $tab) {
            /** @var Tab $tab */
            $normalized = array_merge($normalized, $tab->getSchema());
        }

        return $normalized;
    }

    public function toArray(): array
    {
        return [
            'type' => 'tabs',
            'key'  => $this->key,
            'tabs' => $this->getTabs(),
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
