# Example City

create migration

```php
<?php
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
<?php
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

use App\Builder\Forms\CityForm;
use App\Builder\Tables\CityTable;
use App\Http\Requests\CityStoreRequest;
use App\Http\Requests\CityUpdateRequest;
use App\Models\City;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    public function index(): Response
    {
        $table = CityTable::build();

        return Inertia::render('builder/index', [
            'data' => $table,
        ]);
    }

    public function actions(): RedirectResponse
    {
        return CityTable::actions();
    }

    public function show(City $city): Response
    {
        return Inertia::render('builder/show', [
            'form' => CityForm::view($city),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => CityForm::create(),
        ]);
    }

    public function edit(City $city): Response
    {
        return Inertia::render('builder/edit', [
            'form' => CityForm::edit($city),
        ]);
    }

    public function store(CityStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $item = City::create($data);

        return redirect()
            ->route('cities.index')
            ->with('success', 'Item '.$item->id.' created successfully.');
    }

    public function update(CityUpdateRequest $request, City $city): RedirectResponse
    {
        $data = $request->validated();
        $city->update($data);

        return redirect()
            ->route('cities.edit', $city)
            ->with('success', 'Item '.$city->id.' updated successfully.');
    }

    public function destroy(City $city): RedirectResponse
    {
        $city->delete();

        return redirect()
            ->route('cities.index')
            ->with('success', 'Item '.$city->id.' deleted successfully.');
    }
}
```

`CityForm` class

```php
<?php

namespace App\Builder\Forms;

use App\Models\City;
use App\Models\Province;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class CityForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->view()
            ->schema([
                Field::text('name'),
                Field::select('province_id')
                    ->label('Province')
                    ->relationship(Province::class, 'name')
                    ->disable(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->edit()
            ->schema([
                Field::text('name'),
                Field::select('province_id')
                    ->label('Province')
                    ->relationship(Province::class, 'name'),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model(new City)
            ->create()
            ->schema([
                Field::text('name'),
                Field::select('province_id')
                    ->label('Province')
                    ->relationship(Province::class, 'name'),
            ]);
    }
}
```

`CityTable` class

```php
<?php

namespace App\Builder\Tables;

use App\Models\City;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class CityTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(City::class)
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
                    ->query(fn ($query, $op, $val) => $query->whereHas('province', function ($q) use ($op, $val) {
                        $q->where('name', $op, $val);
                    })),
            ])
            ->defaultSort('id', 'asc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->label('Batch Delete')
                    ->message('Are you sure to delete multiple row?'),
            ]);
    }

    public static function actions(): RedirectResponse
    {
        $action = request()->get('action');
        $ids = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('cities.create');
            case 'delete':
                City::destroy($ids);

                return redirect()
                    ->route('cities.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('cities.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```
