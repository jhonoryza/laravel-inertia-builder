# Example Districts

create migration

```php
<?php
    public function up(): void
    {
        Schema::create('districts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('city_id');
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }
```

generate scaffold `php artisan inertia-builder:generate districts`

edit `District` model

```php
<?php
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'city_id' => 'string',
            'id' => 'string',
        ];
    }
```

edit `DistrictController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Builder\Forms\DistrictForm;
use App\Builder\Tables\DistrictTable;
use App\Http\Requests\DistrictStoreRequest;
use App\Http\Requests\DistrictUpdateRequest;
use App\Models\District;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DistrictController extends Controller
{
    public function index(): Response
    {
        $table = DistrictTable::build();

        return Inertia::render('builder/index', [
            'data' => $table,
        ]);
    }

    public function actions(): RedirectResponse
    {
        return DistrictTable::actions();
    }

    public function show(District $district): Response
    {
        return Inertia::render('builder/show', [
            'form' => DistrictForm::view($district),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => DistrictForm::create(),
        ]);
    }

    public function edit(District $district): Response
    {
        return Inertia::render('builder/edit', [
            'form' => DistrictForm::edit($district),
        ]);
    }

    public function store(DistrictStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $item = District::create($data);

        return redirect()
            ->route('districts.index')
            ->with('success', 'Item '.$item->id.' created successfully.');
    }

    public function update(DistrictUpdateRequest $request, District $district): RedirectResponse
    {
        $data = $request->validated();
        $district->update($data);

        return redirect()
            ->route('districts.edit', $district)
            ->with('success', 'Item '.$district->id.' updated successfully.');
    }

    public function destroy(District $district): RedirectResponse
    {
        $district->delete();

        return redirect()
            ->route('districts.index')
            ->with('success', 'Item '.$district->id.' deleted successfully.');
    }
}

```

`DistrictForm` class

```php
<?php

namespace App\Builder\Forms;

use App\Models\City;
use App\Models\District;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class DistrictForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->view()
            ->schema([
                Field::text('name'),
                Field::text('city_id')
                    ->label('City')
                    ->state(fn ($model) => $model->city->name),
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
                Field::select('city_id')
                    ->label('City')
                    ->relationship(City::class, 'name'),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model(new District)
            ->create()
            ->schema([
                Field::text('name'),
                Field::select('city_id')
                    ->label('City')
                    ->relationship(City::class, 'name'),
            ]);
    }
}
```

`DistrictTable` class

```php
<?php

namespace App\Builder\Tables;

use App\Models\City;
use App\Models\District;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class DistrictTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(District::class)
            ->columns([
                TableColumn::make('id')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('city.name')
                    ->label('City')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::select('city_id')
                    ->label('City')
                    ->relationship(City::class, 'name', 'name')
                    ->query(fn ($query, $op, $val) => $query->whereHas('city', function ($q) use ($op, $val) {
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
                return redirect()->route('districts.create');
            case 'delete':
                District::destroy($ids);

                return redirect()
                    ->route('districts.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('districts.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```
