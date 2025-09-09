# Example Subdistricts

create migration

```php
<?php
    public function up(): void
    {
        Schema::create('subdistricts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('district_id');
            $table->foreign('district_id')->references('id')->on('districts');
        });
    }
```

generate scaffold `php artisan inertia-builder:generate subdistricts`

edit `Subdistrict` model

```php
<?php
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'district_id' => 'string',
            'id' => 'string',
        ];
    }
```

edit `SubdistrictController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Builder\Forms\SubdistrictForm;
use App\Builder\Tables\SubdistrictTable;
use App\Http\Requests\SubdistrictStoreRequest;
use App\Http\Requests\SubdistrictUpdateRequest;
use App\Models\Subdistrict;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubdistrictController extends Controller
{
    public function index(): Response
    {
        $table = SubdistrictTable::build();

        return Inertia::render('builder/index', [
            'data' => $table,
        ]);
    }

    public function actions(): RedirectResponse
    {
        return SubdistrictTable::actions();
    }

    public function show(Subdistrict $subdistrict): Response
    {
        return Inertia::render('builder/show', [
            'form' => SubdistrictForm::view($subdistrict),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => SubdistrictForm::create(),
        ]);
    }

    public function edit(Subdistrict $subdistrict): Response
    {
        return Inertia::render('builder/edit', [
            'form' => SubdistrictForm::edit($subdistrict),
        ]);
    }

    public function store(SubdistrictStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $item = Subdistrict::create($data);

        return redirect()
            ->route('subdistricts.index')
            ->with('success', 'Item '.$item->id.' created successfully.');
    }

    public function update(SubdistrictUpdateRequest $request, Subdistrict $subdistrict): RedirectResponse
    {
        $data = $request->validated();
        $subdistrict->update($data);

        return redirect()
            ->route('subdistricts.edit', $subdistrict)
            ->with('success', 'Item '.$subdistrict->id.' updated successfully.');
    }

    public function destroy(Subdistrict $subdistrict): RedirectResponse
    {
        $subdistrict->delete();

        return redirect()
            ->route('subdistricts.index')
            ->with('success', 'Item '.$subdistrict->id.' deleted successfully.');
    }
}

```

`SubdistrictForm` class

```php
<?php

namespace App\Builder\Forms;

use App\Models\District;
use App\Models\Subdistrict;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class SubdistrictForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->view()
            ->schema([
                Field::text('name')
                    ->info(),
                Field::text('district_id')
                    ->label('District')
                    ->state(fn ($model) => $model->district->name)
                    ->info(),
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
                Field::select('district_id')
                    ->label('District')
                    ->searchable()
                    ->serverside()
                    ->relationship(District::class, 'name', modifyQueryUsing: function ($q) {
                        $search = request()->get('district_id_q');
                        $q
                            ->when(
                                $search,
                                fn ($q) => $q->where('name', 'ilike', '%'.$search.'%')
                            )
                            ->limit(5);
                    }),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model(new Subdistrict)
            ->create()
            ->schema([
                Field::text('name'),
                Field::select('district_id')
                    ->label('District')
                    ->searchable()
                    ->serverside()
                    ->relationship(District::class, 'name', modifyQueryUsing: function ($q) {
                        $search = request()->get('district_id_q');
                        $q
                            ->when(
                                $search,
                                fn ($q) => $q->where('name', 'ilike', '%'.$search.'%')
                            )
                            ->limit(5);
                    }),
            ]);
    }
}
```

`SubdistrictTable` class

```php
<?php

namespace App\Builder\Tables;

use App\Models\District;
use App\Models\Subdistrict;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class SubdistrictTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(Subdistrict::class)
            ->columns([
                TableColumn::make('id')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('district.name')
                    ->label('District')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::select('district_id')
                    ->label('District')
                    ->searchable()
                    ->serverside()
                    ->relationship(District::class, 'name', 'name', modifyQueryUsing: function ($q) {
                        $search = request()->get('district_id_q');
                        $q
                            ->when(
                                $search,
                                fn($q) => $q->where('name', 'ilike', '%' . $search . '%')
                            )
                            ->limit(5);
                    })
                    ->query(fn($query, $op, $val) => $query->whereHas('district', function ($q) use ($op, $val) {
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
                return redirect()->route('subdistricts.create');
            case 'delete':
                Subdistrict::destroy($ids);

                return redirect()
                    ->route('subdistricts.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('subdistricts.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```
