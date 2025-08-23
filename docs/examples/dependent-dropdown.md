# Example field dependent dropdowns

```php
private function getForm(?Subdistrict $subdistrict = null, $disable = false)
{
    $subdistrict?->load('district.city.province');
    $reqProvinceId = request()->input('province_id');
    $reqCityId = request()->input('city_id');
    $reqDistrictId = request()->input('district_id');
    $provinceId = $reqProvinceId ?: $subdistrict?->district?->city?->province_id;
    $cityId = $reqCityId ?: ($reqProvinceId ? null : $subdistrict?->district?->city_id);
    $districtId = $reqDistrictId ?: ($reqCityId || $reqProvinceId ? null : $subdistrict?->district_id);

    return Form::make()
        ->fields([
            Field::select('province_id')
                ->label('Province')
                ->relationship(Province::class, 'name')
                ->reactive()
                ->defaultValue($provinceId)
                ->disable($disable),
            Field::select('city_id')
                ->placeholder('Select Province first')
                ->label('City')
                ->reactive()
                //->relationship(City::class, 'name')
                //->dependsOn(dependencyField: 'province_id', foreignKey: 'province_id', value: $provinceId)
                ->loadOptionsUsing(function () use ($provinceId) {
                    return City::query()
                        ->when(
                            $provinceId,
                            fn($q) => $q->where('province_id', $provinceId),
                            fn($q) => $q->whereNull('id'),
                        );
                })
                ->defaultValue($cityId)
                ->disable($disable),
            Field::select('district_id')
                ->label('District')
                ->reactive()
                ->relationship(District::class, 'name')
                ->dependsOn(dependencyField: 'city_id', foreignKey: 'city_id', value: $cityId)
                ->defaultValue($districtId)
                ->disable($disable),
    ]);
}
```

---

## Example filter dependent dropdowns

```php
[
    Filter::select('province_id')
        ->label('Province')
        ->relationship(Province::class, 'name')
        ->query(function ($query, $op, $val) {
            $query->whereHas('district.city', function ($query) use ($op, $val) {
                if ($op == 'in') {
                    $tmp = explode(',', $val);
                    $query->whereIn('province_id', $tmp);
                    return;
                }
                $query->where('province_id', $op, $val);
            });
        }),
    Filter::select('city_id')
        ->label('City')
        ->searchable()
        ->relationship(City::class, 'name', 'id', function ($query) {
            $value = request()->input('filter.province_id');
            $tmp = str_contains($value, ':') ? explode(':', $value, 2) : $value;
            if (str_contains($tmp[1] ?? null, ',')) {
                $val = explode(',', $tmp[1] ?? null);
                $query->whereIn('province_id', $val ?? []);
                return;
            }
            $query->where('province_id', $tmp[0] ?? '=', $val ?? []);
        })
        ->query(function ($query, $op, $val) {
            $query->whereHas('district', function ($query) use ($op, $val) {
                $query->where('city_id', $op, $val);
            });
        }),
    Filter::select('district_id')
        ->label('District')
        ->searchable()
        ->relationship(District::class, 'name', 'id', function ($query) {
            $value = request()->input('filter.city_id');
            $tmp = str_contains($value, ':') ? explode(':', $value, 2) : $value;
            $query->where('city_id', $tmp[0] ?? '=', $tmp[1] ?? null);
        })
        ->query(function ($query, $op, $val) {
            $query->where('district_id', $op, $val);
        }),
]
```

---