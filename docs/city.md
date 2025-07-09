# Example City

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\CityStoreRequest;
use App\Http\Requests\CityUpdateRequest;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use App\Models\City;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(City::class)
            ->columns([
                TableColumn::make('id')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('province_id')
                    ->label('Province')
                    ->belongsTo('province', 'name')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::select('province_id')
                    ->label('Province')
                    ->relationship(Province::class, 'name', 'name')
                    ->query(fn($query, $op, $val) => $query->whereHas('province', function ($q) use ($op, $val) {
                        $q->where('name', $op, $val);
                    }))
                    ->searchable(),
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
            'routeName' => 'cities',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('cities.create');
            case 'delete':
                City::destroy($ids);

                return redirect()
                    ->route('cities.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('cities.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getFormFields(?City $city = null, $disable = false): array
    {
        return [
            Field::text('name')
                ->defaultValue($city?->name)
                ->disable($disable),
            Field::select('province_id')
                ->label('Province')
                ->relationship(Province::class, 'name')
                ->defaultValue($city?->province_id)
                ->disable($disable),
        ];
    }

    public function show(City $city): Response
    {
        return Inertia::render('builder/show', [
            'fields' => $this->getFormFields($city, true),
            'routeName' => 'cities',
            'routeId' => $city->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'fields' => $this->getFormFields(),
            'routeName' => 'cities',
        ]);
    }

    public function edit(City $city): Response
    {
        return Inertia::render('builder/edit', [
            'fields' => $this->getFormFields($city),
            'routeName' => 'cities',
            'routeId' => $city->id,
        ]);
    }

    public function store(CityStoreRequest $request): RedirectResponse
    {
        $item = City::create($request->validated());

        return redirect()
            ->route('cities.index')
            ->with('description', $item->id)
            ->with('success', 'Item created successfully.');
    }

    public function update(CityUpdateRequest $request, City $city): RedirectResponse
    {
        $city->update($request->validated());

        return redirect()
            ->route('cities.edit', $city)
            ->with('description', $city->id)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(City $city): RedirectResponse
    {
        $city->delete();

        return redirect()
            ->route('cities.index')
            ->with('description', $city->id)
            ->with('success', 'Item deleted successfully.');
    }
}

```