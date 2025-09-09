<?php

namespace Jhonoryza\InertiaBuilder\Controllers;

use Illuminate\Http\Request;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class ReactiveController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $state     = $request->input('state', []);
        $name      = $request->input('name');
        $value     = $request->input('value');
        $formClass = $request->input('formClass');
        $mode      = $request->input('mode');

        /** @var Form form * */
        $form = $formClass::$mode($state);

        $form->handleLiveUpdate($name, $value, $state);

        return response()->json($form);
    }
}
