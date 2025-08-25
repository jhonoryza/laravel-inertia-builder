<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Forms;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class Get
{
    protected AbstractField $field;

    public function __construct(AbstractField $field)
    {
        $this->field = $field;
    }

    /**
     * Ambil state field lain
     *
     * @param string $path
     * @return mixed
     */
    public function __invoke(string $path = ''): mixed
    {
        $form = $this->field->form;
        $state = $form->getState();

        return data_get($state, $path);
    }
}
