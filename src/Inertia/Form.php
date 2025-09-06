<?php

namespace Jhonoryza\InertiaBuilder\Inertia;

use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasColumns;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasFields;
use JsonSerializable;
use Illuminate\Support\Str;

class Form implements JsonSerializable
{
    use HasColumns, HasFields;

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

    public function state(array $state): static
    {
        if (! empty($state)) {
            $this->state = $state;
        }

        return $this;
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

    public function getModel(): ?Model
    {
        return $this->model;
    }

    public function getModelName(): string
    {
        return Str::camel(class_basename($this->model));
    }

    public function getState(): array
    {
        return $this->state;
    }

    // kenapa form class harus punya state berisi data state semua field
    // yaitu untuk override state dari sebuah field ketika field lain berubah state nya
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

    private function checkisStateEmpty(): void
    {
        if (empty($this->state)) {
            foreach ($this->getFields() as $field) {
                $field->form($this);

                $state      = $this->model?->{$field->getName()} ?? null;
                $fieldState = $field->getState();
                $state      = $fieldState !== null ? $fieldState : $state;

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
