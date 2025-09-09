# Date & Datetime Fields

The Date and Datetime fields provide simple date and datetime pickers for your forms. They are suitable for basic date selection without advanced configuration.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

// Date picker
Field::date('birthday');

// Datetime picker
Field::datetimeLocal('appointment');
```

## Important Methods & Options

- **placeholder(string $text):** Set custom placeholder text for the input.
- **mergeClass(string $class):** Add custom CSS classes for styling.
- **disable(bool $state = true):** Disable the field, making it non-interactive.
- **hidden(bool $state = true):** Hide the field from the form.
- **label(string $label):** Set a custom label for the field.
- **defaultValue(mixed $value):** Set the default value for the field.
- **inline():** Display the field inline with others.
- **columnSpan(array $span):** Set the column span for grid layouts.
- **columnOrder(array $order):** Set the column order for grid layouts.

All methods return the field instance, allowing method chaining.

## Example

```php
<?php
Field::date('start_date')
    ->placeholder('Pick a start date')
    ->mergeClass('w-40')
    ->disable(false)
    ->hidden(false)
    ->label('Start Date')
    ->defaultValue('2024-06-01');

Field::datetimeLocal('event_time')
    ->placeholder('Pick date and time')
    ->mergeClass('w-64')
    ->disable()
    ->label('Event Time');
```

## Notes

- Date field uses a calendar for date selection.
- Datetime field allows both date and time selection.
- For more advanced date/time picking (range, time, etc.), use the [Flatpickr field](./flatpickr.md).
