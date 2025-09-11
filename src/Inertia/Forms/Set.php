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
            $key = $path->getKey();
        } else {
            $key = $path;
        }

        $newValue = $state instanceof \Closure
            ? $state()
            : $state;

        data_set($this->formState, $key, $newValue);

        return $newValue;
    }
}
