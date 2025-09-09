# Grid field

this field allows you to make a group from some fields

## Usage

```php
<?php
return Form::make()
    ->view()
    ->model($state)
    ->columns(1)
    ->schema([
        Grid::make()
            ->columns(2)
            ->schema([
                Field::text('name')
                    ->info(),
                Field::text('email')
                    ->info(),
                Field::text('company_name')
                    ->info(),
                Field::text('status')
                    ->info(),
            ]),
        Field::checkboxList('games')
            ->label('Games Checklist')
            ->gridCol(3)
            ->loadOptionsUsing(function () {
                return Game::query()
                    ->where('is_active', true);
            })
            ->state(function (?Team $model) {
                return $model?->games?->pluck('id')?->toArray();
            })
            ->disable()
    ]);
```

## Important Options

- **columns(int|array $columns):** Set the grid column size.
- **schema(array $fields):** Add array of field.

## Examples

if you want a responsive grid on different screen size.

```php
<?php
Grid::make()
    ->columns([
        'default' => 1
        'sm'      => 2,
        'md'      => 3,
    ])
```
