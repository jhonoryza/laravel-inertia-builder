<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables;

use JsonSerializable;

class TableColumn implements JsonSerializable
{
    public static function make(string $name): static
    {
        return new static($name);
    }

    public string $name;
    public string $label;
    public bool $sortable = false;
    public bool $searchable = false;
    public bool $hidden = false;
    /**
     * @var callable|null
     */
    public $renderUsing = null;
    public ?string $relation = null;
    public ?string $relationKey = null;
    public ?string $relationType = null; // 'belongsTo' | 'hasMany'

    public function __construct(string $name)
    {
        $this->name = $name;
        $this->label = ucwords(str_replace('_', ' ', $name));
    }

    public function label(string $label): static
    {
        $this->label = $label;
        return $this;
    }

    public function sortable(): static
    {
        $this->sortable = true;
        return $this;
    }

    public function searchable(): static
    {
        $this->searchable = true;
        return $this;
    }

    public function hidden(): static
    {
        $this->hidden = true;
        return $this;
    }

    /**
     * Set a callback to render/format the value before send to frontend
     *
     * @param callable $callback function($value, $row): mixed
     * @return $this
     */
    public function renderUsing(callable $callback): static
    {
        $this->renderUsing = $callback;
        return $this;
    }

    public function belongsTo(string $relation, string $displayField): static
    {
        $this->relation = $relation;
        $this->relationKey = $displayField;
        $this->relationType = 'belongsTo';
        return $this;
    }

    public function hasMany(string $relation, string $displayField): static
    {
        $this->relation = $relation;
        $this->relationKey = $displayField;
        $this->relationType = 'hasMany';
        return $this;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'label' => $this->label,
            'sortable' => $this->sortable,
            'searchable' => $this->searchable,
            'hidden' => $this->hidden,
            'relation' => $this->relation,
            'relationKey' => $this->relationKey,
            'relationType' => $this->relationType,
        ];
    }

    /**
     * Specify data which should be serialized to JSON
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
