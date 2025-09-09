# Flatpickr Field

The Flatpickr field provides a flexible date and time picker powered by the [flatpickr](https://flatpickr.js.org/) library. It supports date, time, and range selection, as well as custom configuration.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

// Basic date picker
Field::flatpickr('start_date');

// Date and time picker
Field::flatpickr('event_time')->withTime(true);

// Range picker
Field::flatpickr('period')->mode('range');
```

## Important Options

- **mode(string $mode):** Set the picker mode (`single`, `range`, etc.).
  - Example: `->mode('range')`
- **withTime(bool $withTime = true):** Enable time selection.
  - Example: `->withTime(true)`
- **utcConvert(bool $utc = true):** Convert selected date/time to UTC ISO string.
  - Example: `->utcConvert(false)`
- **config(array $config):** Pass custom flatpickr configuration options.
  - Example: `->config(['minDate' => 'today'])`
- **placeholder(string $text):** Set custom placeholder text.
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
<?php
Field::flatpickr('meeting')
    ->withTime(true)
    ->mode('single')
    ->config(['minDate' => 'today'])
    ->placeholder('Select meeting date and time');
```

## Notes

- Supports both single and range selection.
- Time selection can be enabled or disabled.
- Custom configuration allows advanced usage (see [flatpickr docs](https://flatpickr.js.org/options/)).
