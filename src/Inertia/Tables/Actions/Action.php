<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Actions;

use Illuminate\Support\Str;
use JsonSerializable;

class Action implements JsonSerializable
{
    private bool $rowSelected = true;

    private bool $needConfirm = true;

    public function __construct(
        private string $name,
        private string $label = '',
        private string $message = '',
    ) {
        $this->label = Str::of($name)
            ->replace('_', ' ')
            ->replace('-', ' ')
            ->title();
        $this->message = 'Are you sure you want to ' . $this->label . ' selected items?';
    }

    public static function make($name): static
    {
        return new static($name);
    }

    public function message(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function needRowSelected($state = true): static
    {
        $this->rowSelected = $state;

        return $this;
    }

    public function needConfirm($state = true): static
    {
        $this->needConfirm = $state;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'name'        => $this->name,
            'label'       => $this->label,
            'message'     => $this->message,
            'rowSelected' => $this->rowSelected,
            'needConfirm' => $this->needConfirm,
        ];
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}
