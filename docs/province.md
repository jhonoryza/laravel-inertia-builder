# Example Province

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProvinceStoreRequest;
use App\Http\Requests\ProvinceUpdateRequest;
use App\Inertia\Fields\Factory\Field;
use App\Inertia\Tables\Actions\Action;
use App\Inertia\Tables\Filters\Factory\Filter;
use App\Inertia\Tables\Table;
use App\Inertia\Tables\TableColumn;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(Province::class)
            ->columns([
                TableColumn::make('id')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
            ])
            ->defaultSort('id', 'desc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this item?'),
            ]);

        return Inertia::render('builder/index', [
            'data' => $table,
            'routeName' => 'provinces',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('provinces.create');
            case 'delete':
                Province::destroy($ids);

                return redirect()
                    ->route('provinces.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('provinces.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getFormFields(?Province $province = null, $disable = false): array
    {
        return [
            Field::text('name')
                ->defaultValue($province?->name)
                ->disable($disable),
        ];
    }

    public function show(Province $province): Response
    {
        return Inertia::render('builder/show', [
            'fields' => $this->getFormFields($province, true),
            'routeName' => 'provinces',
            'routeId' => $province->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'fields' => $this->getFormFields(),
            'routeName' => 'provinces',
        ]);
    }

    public function edit(Province $province): Response
    {
        return Inertia::render('builder/edit', [
            'fields' => $this->getFormFields($province),
            'routeName' => 'provinces',
            'routeId' => $province->id,
        ]);
    }

    public function store(ProvinceStoreRequest $request): RedirectResponse
    {
        $item = Province::create($request->validated());

        return redirect()
            ->route('provinces.index')
            ->with('description', $item->id)
            ->with('success', 'Item created successfully.');
    }

    public function update(ProvinceUpdateRequest $request, Province $province): RedirectResponse
    {
        $province->update($request->validated());

        return redirect()
            ->route('provinces.edit', $province)
            ->with('description', $province->id)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Province $province): RedirectResponse
    {
        $province->delete();

        return redirect()
            ->route('provinces.index')
            ->with('description', $province->id)
            ->with('success', 'Item deleted successfully.');
    }
}

```