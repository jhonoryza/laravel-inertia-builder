# Form

This class is used to wrap dynamic fields

## Usage

```php
<?php
return Form::make()
    ->view()
    ->model($state)
    ->columns(1)
    ->schema([
        Field::text('role')
            ->info()
            ->state(fn(?Admin $model) => $model?->roles()?->first()?->name),
        Field::text('name')
            ->info(),
        Field::text('username')
            ->info(),
        Field::email('email')
            ->info(),
        Field::text('is_active')
            ->info(),
        Field::text('last_login')
            ->info(),
    ]);
```

## Important Options

- **view():** Set as view mode.
- **create():** Set as create mode.
- **edit():** Set as edit mode.
- **model($model):** Set form state using model class.
- **columns(int|array $columns):** Set grid column size.
- **schema(array $fields):** Set fields that will be used.
