<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Jhonoryza\InertiaBuilder\Inertia\Form;

trait HasForm
{
    public ?Form $form = null;

    public function form(Form $form): static
    {
        $this->form = $form;

        return $this;
    }
}
