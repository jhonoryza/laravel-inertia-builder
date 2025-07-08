# Example Subdistricts

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubdistrictStoreRequest;
use App\Http\Requests\SubdistrictUpdateRequest;
use App\Inertia\Fields\Factory\Field;
use App\Inertia\Tables\Actions\Action;
use App\Inertia\Tables\Filters\Factory\Filter;
use App\Inertia\Tables\Filters\Operator;
use App\Inertia\Tables\Table;
use App\Inertia\Tables\TableColumn;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\Subdistrict;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubdistrictController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(Subdistrict::class)
            ->columns([
                TableColumn::make('id')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('district_id')
                    ->label('District')
                    ->belongsTo('district', 'name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('city_id')
                    ->label('City')
                    ->belongsTo('district.city', 'name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('province_id')
                    ->label('Province')
                    ->belongsTo('district.city.province', 'name')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::select('district_id')
                    ->label('District')
                    ->operators([
                        Operator::equals(),
                        Operator::notEquals(),
                    ])
                    ->searchable()
                    ->serverside()
                    ->relationship(District::class, 'unique_name', 'unique_name', function ($query) {
                        $value = request()->input('district_id_q');
                        $query
                            ->when(
                                $value,
                                fn($q) => $q->whereRaw('LOWER(name) like ?', $value . '%')
                            )
                            ->with('city')
                            ->limit(10);
                    })
                    ->query(function ($query, $op, $val) {
                        $tmp = explode('-', $val);
                        $val = trim($tmp[0] ?? '');
                        $query->whereHas('district', function ($q) use ($op, $val) {
                            $q->where('name', $op, $val);
                        });
                    }),
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
            'routeName' => 'subdistricts',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('subdistricts.create');
            case 'delete':
                Subdistrict::destroy($ids);

                return redirect()
                    ->route('subdistricts.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('subdistricts.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getFormFields(?Subdistrict $subdistrict = null, $disable = false): array
    {
        return [
            Field::select('district_id')
                ->label('District')
                ->searchable()
                ->serverside()
                ->relationship(District::class, 'name', 'id', function ($query) use ($subdistrict) {
                    $value = request()->input('district_id_q');
                    $query
                        ->when(
                            $value,
                            fn($query) => $query->whereRaw('LOWER(name) like ?', '%' . $value . '%'),
                        )
                        ->when(
                            $subdistrict?->district_id && empty($value),
                            fn($query) => $query->where('id', $subdistrict?->district_id),
                        )
                        ->limit(5);
                })
                ->defaultValue($subdistrict?->district_id)
                ->disable($disable),
            Field::text('name')
                ->label('Subdistrict')
                ->defaultValue($subdistrict?->name)
                ->disable($disable),
        ];
    }

    public function show(Subdistrict $subdistrict): Response
    {
        return Inertia::render('builder/show', [
            'fields' => $this->getFormFields($subdistrict, true),
            'routeName' => 'subdistricts',
            'routeId' => $subdistrict->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'fields' => $this->getFormFields(),
            'routeName' => 'subdistricts',
        ]);
    }

    public function edit(Subdistrict $subdistrict): Response
    {
        return Inertia::render('builder/edit', [
            'fields' => $this->getFormFields($subdistrict),
            'routeName' => 'subdistricts',
            'routeId' => $subdistrict->id,
        ]);
    }

    public function store(SubdistrictStoreRequest $request): RedirectResponse
    {
        $item = Subdistrict::create($request->validated());

        return redirect()
            ->route('subdistricts.index')
            ->with('description', $item->id)
            ->with('success', 'Item created successfully.');
    }

    public function update(SubdistrictUpdateRequest $request, Subdistrict $subdistrict): RedirectResponse
    {
        $subdistrict->update($request->validated());

        return redirect()
            ->route('subdistricts.edit', $subdistrict)
            ->with('description', $subdistrict->id)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Subdistrict $subdistrict): RedirectResponse
    {
        $subdistrict->delete();

        return redirect()
            ->route('subdistricts.index')
            ->with('description', $subdistrict->id)
            ->with('success', 'Item deleted successfully.');
    }
}
```

---