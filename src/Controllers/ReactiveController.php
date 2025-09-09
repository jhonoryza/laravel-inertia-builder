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
        $state      = $request->input('state', []);
        $key        = $request->input('key');
        $value      = $request->input('value');
        $formClass  = $request->input('formClass');
        $mode       = $request->input('mode');
        $routeId    = $request->input('routeId');
        $modelClass = $request->input('modelClass');

        $model = $modelClass::find($routeId);

        /** @var Form form * */
        $form = $formClass::$mode($model);

        $form->handleLiveUpdate($key, $value, $state);

        return response()->json($form);
    }
}
