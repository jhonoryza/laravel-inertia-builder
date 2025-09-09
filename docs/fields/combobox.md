# ComboBox Field

The ComboBox field provides a searchable dropdown for selecting one or multiple options.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::combobox('country')
    ->options([
        ['label' => 'Indonesia', 'value' => 'ID'],
        ['label' => 'Singapore', 'value' => 'SG'],
    ]);
```

## Important Options

- **options(array $options):** Set the available choices.
  - Example: `->options([['label' => 'A', 'value' => 'a'], ...])`
- **multiple(bool $multiple = true):** Allow multiple selections.
  - Example: `->multiple()`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
<?php
Field::combobox('tags')
    ->options([
        ['label' => 'PHP', 'value' => 'php'],
        ['label' => 'Laravel', 'value' => 'laravel'],
    ])
    ->multiple();
```

## Notes

- Supports single or multiple selection.
- Useful for tags, categories, or any searchable dropdown.
