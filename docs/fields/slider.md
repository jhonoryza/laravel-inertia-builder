# Slider Field

The Slider field provides an interactive slider for selecting a numeric value within a defined range.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::slider('rating');
```

## Important Options

- **min(int $min):** Set the minimum value.
  - Example: `->min(1)`
- **max(int $max):** Set the maximum value.
  - Example: `->max(10)`
- **step(int $step):** Set the increment step.
  - Example: `->step(1)`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
<?php
Field::slider('progress')
    ->min(0)
    ->max(100)
    ->step(5)
    ->mergeClass('w-64');
```

## Notes

- Useful for ratings, progress, or any numeric range selection.
