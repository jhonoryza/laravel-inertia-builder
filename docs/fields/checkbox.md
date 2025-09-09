# Checkbox & CheckboxList Fields

Checkbox fields allow users to toggle a single boolean value, while CheckboxList fields let users select multiple options from a list.

## Usage

### Checkbox

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::checkbox('is_active');
```

### CheckboxList

```php
<?php
Field::checkboxList('interests')
    ->options([
        ['label' => 'Technology', 'value' => 'technology'],
        ['label' => 'Business', 'value' => 'business'],
    ]);
```

## Important Options

- **options(array $options):** (CheckboxList only) Set the available choices.
  - Example: `->options([['label' => 'A', 'value' => 'a'], ...])`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
<?php
Field::checkbox('newsletter');

Field::checkboxList('skills')
    ->options([
        ['label' => 'PHP', 'value' => 'php'],
        ['label' => 'JavaScript', 'value' => 'js'],
    ]);
```

## Notes

- Checkbox: Use for single boolean values.
- CheckboxList: Use for multiple selections from a list.
