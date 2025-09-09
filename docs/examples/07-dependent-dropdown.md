# Example field dependent dropdowns

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

public static function edit(Model $state): Form
{
    return Form::make(static::class)
        ->fields([
            Field::select('province_id')
                ->label('Province')
                ->relationship(Province::class, 'name')
                ->reactive(),
            Field::select('city_id')
                ->placeholder('Select Province first')
                ->label('City')
                ->reactive()
                ->loadOptionsUsing(function (Get $get) {
                    $provinceId = $get('province_id');
                    return City::query()
                        ->when($provinceId, fn($q) => $q->where('province_id', $provinceId));
                }),
            Field::select('district_id')
                ->label('District')
                ->reactive()
                ->loadOptionsUsing(function (Get $get) {
                    $cityId = $get('city_id');
                    return District::query()
                        ->when($cityId, fn($q) => $q->where('city_id', $cityId));
                }),
            Field::select('subdistrict_id')
                ->label('District')
                ->loadOptionsUsing(function (Get $get) {
                    $districtId = $get('district_id');
                    return District::query()
                        ->when($districtId, fn($q) => $q->where('district_id', $districtId));
                }),
    ]);
}
```

---

## Example filter dependent dropdowns

```php
<?php

->filters([
    Filter::select('city_id')
        ->label('City')
        ->searchable()
        ->serverside()
        ->relationship(City::class, 'name', 'name', modifyQueryUsing: function ($query) {
            // city name
            $search = request()->input('city_id_q');
            // cari city yg memiliki name ?
            $query
                ->when(
                    $search,
                    fn ($q) => $q->where('name', 'ilike', '%'.$search.'%')
                )
                ->limit(5);
        })
        ->query(function ($query, $op, $val) {
            // filter subdistrict berdasarkan nama city
            $query->whereHas('district.city', function ($query) use ($op, $val) {
                $query->where('name', $op, $val);
            });
        }),
    Filter::select('district_id')
        ->label('District')
        ->searchable()
        ->serverside()
        ->relationship(District::class, 'name', 'name', modifyQueryUsing: function ($query) {
            // district name
            $search = request()->input('district_id_q');
            $filter = request()->input('filter.city_id');

            // cari district yg memiliki name ? dan city name ?
            $query
                ->whereHas('city', function ($q) use ($filter) {
                    // $tmp -> :=bandung
                    $tmp = str_contains($filter, ':') ? explode(':', $filter, 2) : $filter;
                    $q->where('name', $tmp[0] ?? '=', $tmp[1] ?? null);
                })
                ->when(
                    $search,
                    fn ($q) => $q->where('name', 'ilike', '%'.$search.'%')
                )
                ->limit(5);
        })
        ->query(function ($query, $op, $val) {
            // filter subdistrict berdasarkan nama district
            $query->whereHas('district', function ($q) use ($op, $val) {
                $q->where('name', $op, $val);
            });
        }),
])
```

---
