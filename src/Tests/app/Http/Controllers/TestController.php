<?php

namespace App\Http\Controllers;

use App\Builder\Forms\TestForm;
use App\Builder\Tables\TestTable;
use App\Http\Requests\TestStoreRequest;
use App\Http\Requests\TestUpdateRequest;
use App\Models\Test;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('builder/index', [
            'data' => TestTable::build(),
        ]);
    }

    public function actions(): RedirectResponse
    {
        return TestTable::actions();
    }

    public function show(Test $test): Response
    {
        return Inertia::render('builder/show', [
            'form' => TestForm::view($test),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => TestForm::create(),
        ]);
    }

    public function edit(Test $test): Response
    {
        return Inertia::render('builder/edit', [
            'form' => TestForm::edit($test),
        ]);
    }

    public function store(TestStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $test = Test::create($data);

        return redirect()
            ->route('tests.index')
            ->with('success', 'Item ' . $test->id . ' created successfully.');
    }

    public function update(TestUpdateRequest $request, Test $test): RedirectResponse
    {
        $data = $request->validated();
        $test->update($data);

        return redirect()
            ->route('tests.edit', $test)
            ->with('success', 'Item ' . $test->id . ' updated successfully.');
    }

    public function destroy(Test $test): RedirectResponse
    {
        $test->delete();

        return redirect()
            ->route('tests.index')
            ->with('success', 'Item ' . $test->id . ' deleted successfully.');
    }
}
