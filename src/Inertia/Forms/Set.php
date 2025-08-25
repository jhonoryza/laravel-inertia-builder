<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Forms;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class Set
{
    public function __construct(
        protected AbstractField $field,
        protected array &$formState, // reference ke state form
    ) {}

    public function __invoke(string|AbstractField $path, mixed $state): mixed
    {
        // Jika inputnya field langsung
        if ($path instanceof AbstractField) {
            $name = $path->getName();
        } else {
            $name = $path;
        }

        $newValue = $state instanceof \Closure
            ? $state()
            : $state;

        data_set($this->formState, $name, $newValue);

        return $newValue;
    }
}
