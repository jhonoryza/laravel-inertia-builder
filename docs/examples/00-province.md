# Example Province

create migration

```php
<?php
    public function up(): void
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
        });
    }
```

generate scaffold `php artisan inertia-builder:generate provinces`

edit `Province` model

```php
<?php
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'id' => 'string',
        ];
    }
```

edit `ProvinceController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Builder\Forms\ProvinceForm;
use App\Builder\Tables\ProvinceTable;
use App\Http\Requests\ProvinceStoreRequest;
use App\Http\Requests\ProvinceUpdateRequest;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
{
    public function index(): Response
    {
        $table = ProvinceTable::build();

        return Inertia::render('builder/index', [
            'data' => $table,
        ]);
    }

    public function actions(): RedirectResponse
    {
        return ProvinceTable::actions();
    }

    public function show(Province $province): Response
    {
        return Inertia::render('builder/show', [
            'form' => ProvinceForm::view($province),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => ProvinceForm::create(),
        ]);
    }

    public function edit(Province $province): Response
    {
        return Inertia::render('builder/edit', [
            'form' => ProvinceForm::edit($province),
        ]);
    }

    public function store(ProvinceStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $item = Province::create($data);

        return redirect()
            ->route('provinces.index')
            ->with('success', 'Item '.$item->id.' created successfully.');
    }

    public function update(ProvinceUpdateRequest $request, Province $province): RedirectResponse
    {
        $data = $request->validated();
        $province->update($data);

        return redirect()
            ->route('provinces.edit', $province)
            ->with('success', 'Item '.$province->id.' updated successfully.');
    }

    public function destroy(Province $province): RedirectResponse
    {
        $province->delete();

        return redirect()
            ->route('provinces.index')
            ->with('success', 'Item '.$province->id.' deleted successfully.');
    }
}
```

`ProvinceForm` class

```php
<?php

namespace App\Builder\Forms;

use App\Models\Province;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class ProvinceForm implements FormContract
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
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model(new Province)
            ->create()
            ->schema([
                Field::text('name'),
            ]);
    }
}

```

`ProvinceTable` class

```php
<?php

namespace App\Builder\Tables;

use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class ProvinceTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(Province::class)
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
                return redirect()->route('provinces.create');
            case 'delete':
                Province::destroy($ids);

                return redirect()
                    ->route('provinces.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('provinces.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```
