<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Concerns;

use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;

interface TableContract
{
	public static function build(): Table;
	public static function actions(): RedirectResponse;
}