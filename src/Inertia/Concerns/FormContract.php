<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Concerns;

use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Form;

interface FormContract
{
    public static function build(Model|array|null $model = null, string $action = 'create or edit'): Form;
}
