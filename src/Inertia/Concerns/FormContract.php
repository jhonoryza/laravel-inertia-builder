<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Concerns;

use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Form;

interface FormContract
{
    /**
     * @param  Model|array  $state
     */
    public static function view($state): Form;

    /**
     * @param  Model|array  $state
     */
    public static function edit($state): Form;

    /**
     * @param  Model|array  $state
     */
    public static function create($state): Form;
}
