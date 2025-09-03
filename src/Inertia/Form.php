<?php

namespace Jhonoryza\InertiaBuilder\Inertia;

use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use JsonSerializable;

class Form implements JsonSerializable
{
    protected array $columns = [];

    protected array $fields = [];

    public array $state = [];

    protected ?Model $model = null;

    public static function make(): static
    {
        return new static;
    }

    public function model(?Model $model): self
    {
        if ($model) {
            $this->model = $model;
        }

        return $this;
    }

    public function schema(array $fields): static
    {
        $this->fields = $fields;

        return $this;
    }

    public function fields(array $fields): static
    {
        $this->fields = $fields;

        return $this;
    }

    public function appendFieldToSchema(AbstractField|iterable $field): static
    {
        if ($field instanceof AbstractField) {
            $this->fields[] = $field;
        } else {
            foreach ($field as $f) {
                $this->fields[] = $f;
            }
        }

        return $this;
    }

    public function state(array $state): static
    {
        if (! empty($state)) {
            $this->state = $state;
        }

        return $this;
    }

    public function columns(int|array $columns): self
    {
        if (is_int($columns)) {
            $this->columns = ['default' => $columns];

            return $this;
        }
        $this->columns = $columns;

        return $this;
    }

    public function findField(string $name)
    {
        return collect($this->getFields())
            ->first(fn ($field) => $field->getName() === $name);
    }

    // di panggil saat ada perubahan dari frontend
    public function handleLiveUpdate(string $name, $value, array &$state): array
    {
        /** @var AbstractField|null $field */
        $field = $this->findField($name);

        if (! $field || ! $field->getIsReactive()) {
            return $state;
        }

        $field->triggerAfterStateUpdated($value, $state);

        // update form state
        foreach ($this->getFields() as $f) {
            /** @var AbstractField $f */
            if (isset($state[$f->getName()])) {
                $this->state[$f->getName()] = $state[$f->getName()];
            }
        }

        return $state;
    }

    // di panggil saat initial loads atau ada perubahan dari frontend
    public function evaluateFields(): array
    {
        return collect($this->getFields())
            ->map(function (AbstractField $field) {

                // set form state to field state
                $field->form($this);
                $formState = $this->state[$field->getName()];
                $field->state($formState);

                return $field;
            })
            ->toArray();
    }

    public function getModel(): ?Model
    {
        return $this->model;
    }

    public function getSchema(): array
    {
        return $this->fields;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function getState(): array
    {
        return $this->state;
    }

    public function getColumns(): array
    {
        return $this->columns;
    }

    private function checkisStateEmpty(): void
    {
        if (empty($this->state)) {
            foreach ($this->getFields() as $field) {
                $field->form($this);
                
                $state = $this->model?->{$field->getName()} ?? null;
                $fieldState = $field->getState();
                $state = $fieldState !== null ? $fieldState : $state;

                $this->state[$field->getName()] = $state;
            }
        }
    }

    public function jsonSerialize(): array
    {
        $this->checkisStateEmpty();

        return [
            'columns' => $this->getColumns(),
            'fields'  => $this->evaluateFields(),
        ];
    }
}
