# Example Districts

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\DistrictStoreRequest;
use App\Http\Requests\DistrictUpdateRequest;
use App\Inertia\Fields\Factory\Field;
use App\Inertia\Tables\Actions\Action;
use App\Inertia\Tables\Filters\Factory\Filter;
use App\Inertia\Tables\Table;
use App\Inertia\Tables\TableColumn;
use App\Models\City;
use App\Models\District;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DistrictController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(District::class)
            ->columns([
                TableColumn::make('id')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('city_id')
                    ->label('City')
                    ->belongsTo('city', 'name')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::select('city_id')
                    ->label('City')
                    ->searchable()
                    ->relationship(City::class, 'name', 'name')
                    ->query(fn($query, $op, $val) => $query->whereHas('city', function ($q) use ($op, $val) {
                        $q->where('name', $op, $val);
                    }))
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
            'routeName' => 'districts',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('districts.create');
            case 'delete':
                District::destroy($ids);

                return redirect()
                    ->route('districts.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('districts.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getFormFields(?District $district = null, $disable = false): array
    {
        return [
            Field::text('name')
                ->defaultValue($district?->name)
                ->disable($disable),
            Field::select('city_id')
                ->label('City')
                ->relationship(City::class, 'name')
                ->defaultValue($district?->city_id)
                ->disable($disable),
        ];
    }

    public function show(District $district): Response
    {
        return Inertia::render('builder/show', [
            'fields' => $this->getFormFields($district, true),
            'routeName' => 'districts',
            'routeId' => $district->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'fields' => $this->getFormFields(),
            'routeName' => 'districts',
        ]);
    }

    public function edit(District $district): Response
    {
        return Inertia::render('builder/edit', [
            'fields' => $this->getFormFields($district),
            'routeName' => 'districts',
            'routeId' => $district->id,
        ]);
    }

    public function store(DistrictStoreRequest $request): RedirectResponse
    {
        $item = District::create($request->validated());

        return redirect()
            ->route('districts.index')
            ->with('description', $item->id)
            ->with('success', 'Item created successfully.');
    }

    public function update(DistrictUpdateRequest $request, District $district): RedirectResponse
    {
        $district->update($request->validated());

        return redirect()
            ->route('districts.edit', $district)
            ->with('description', $district->id)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(District $district): RedirectResponse
    {
        $district->delete();

        return redirect()
            ->route('districts.index')
            ->with('description', $district->id)
            ->with('success', 'Item deleted successfully.');
    }
}
```