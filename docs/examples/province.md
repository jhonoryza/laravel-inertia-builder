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
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProvinceStoreRequest;
use App\Http\Requests\ProvinceUpdateRequest;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use Jhonoryza\InertiaBuilder\Inertia\Form;
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
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('provinces.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getForm(?Province $province = null, $disable = false)
    {
        return Form::make(static::class)
            ->fields([
                Field::text('name')
                    ->defaultValue($province?->name)
                    ->disable($disable),
        ]);
    }

    public function show(Province $province): Response
    {
        return Inertia::render('builder/show', [
            'form' => $this->getForm($province, true),
            'routeName' => 'provinces',
            'routeId' => $province->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => $this->getForm(),
            'routeName' => 'provinces',
        ]);
    }

    public function edit(Province $province): Response
    {
        return Inertia::render('builder/edit', [
            'form' => $this->getForm($province),
            'routeName' => 'provinces',
            'routeId' => $province->id,
        ]);
    }

    public function store(ProvinceStoreRequest $request): RedirectResponse
    {
        $item = Province::create($request->validated());

        return redirect()
            ->route('provinces.index')
            ->with('success', 'Item created successfully.');
    }

    public function update(ProvinceUpdateRequest $request, Province $province): RedirectResponse
    {
        $province->update($request->validated());

        return redirect()
            ->route('provinces.edit', $province)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Province $province): RedirectResponse
    {
        $province->delete();

        return redirect()
            ->route('provinces.index')
            ->with('success', 'Item deleted successfully.');
    }
}

```
