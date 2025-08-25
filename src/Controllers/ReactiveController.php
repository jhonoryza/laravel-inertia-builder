<?php

namespace Jhonoryza\InertiaBuilder\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class ReactiveController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $state = $request->input('state', []);
        $name = $request->input('name');
        $value = $request->input('value');
        $formClass = $request->input('formClass');

        /** @var Form form **/
        $form = $formClass::build($state);

        $form->handleLiveUpdate($name, $value, $state);

        return response()->json($form);
    }
}
