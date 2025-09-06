<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Concerns;

use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Form;

interface FormContract
{
    public static function view(Model|array $state): Form;
    public static function edit(Model|array $state): Form;
    public static function create(): Form;
}
