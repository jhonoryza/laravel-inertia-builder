# Example City

create migration

```php
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('province_id');
            $table->foreign('province_id')->references('id')->on('provinces');
        });
    }
```

generate scaffold `php artisan inertia-builder:generate cities`

edit `City` model

```php
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'province_id' => 'string',
            'id' => 'string',
        ];
    }
```

edit `CityController` like this

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
use Jhonoryza\InertiaBuilder\Inertia\Form;

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
                TableColumn::make('province.name')
                    ->label('Province')
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
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('cities.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getForm(?City $city = null, $disable = false)
    {
        return Form::make()
            ->fields([
                Field::text('name')
                    ->defaultValue($city?->name)
                    ->disable($disable),
                Field::select('province_id')
                    ->label('Province')
                    ->relationship(Province::class, 'name')
                    ->defaultValue($city?->province_id)
                    ->disable($disable),
        ]);
    }

    public function show(City $city): Response
    {
        return Inertia::render('builder/show', [
            'form' => $this->getForm($city, true),
            'routeName' => 'cities',
            'routeId' => $city->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => $this->getForm(),
            'routeName' => 'cities',
        ]);
    }

    public function edit(City $city): Response
    {
        return Inertia::render('builder/edit', [
            'form' => $this->getForm($city),
            'routeName' => 'cities',
            'routeId' => $city->id,
        ]);
    }

    public function store(CityStoreRequest $request): RedirectResponse
    {
        $item = City::create($request->validated());

        return redirect()
            ->route('cities.index')
            ->with('success', 'Item created successfully.');
    }

    public function update(CityUpdateRequest $request, City $city): RedirectResponse
    {
        $city->update($request->validated());

        return redirect()
            ->route('cities.edit', $city)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(City $city): RedirectResponse
    {
        $city->delete();

        return redirect()
            ->route('cities.index')
            ->with('success', 'Item deleted successfully.');
    }
}

```