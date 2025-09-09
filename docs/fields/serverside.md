# Server Side

Server side function allow your field to dynamically get available options from the server when doing search.

## How It Works

when you have field name `district_id`, when the value changed it will do inertia partial reload to the current route with query parameter `_q` so you can get current value using `request()->get('district_id_q')`. the example below will show you how to to this

## Example:

```php
<?php

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
```

**Explanation:**
add `serverside()` function to the field that you want to do serverside dynamic load data.
