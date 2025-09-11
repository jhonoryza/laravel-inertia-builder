# CustomField

CustomField allows you to integrate your own React components into the Inertia
form system. This feature is useful for creating input types not available by
default, such as rating selectors, color pickers, or other custom UI widgets.

---

## How It Works

Custom fields must be registered manually in
`resources/js/components/builder/custom-fields/index.ts`.

**Example:**

```typescript
import { ColorPickerField } from "./color-picker-field";
import { RatingField } from "./rating-field";

// Register all custom field components here.
// The key (e.g., 'rating') must match the name used in PHP.
export const customFieldsComponents: Record<
  string,
  React.ComponentType<any>
> = {
  "color-picker": ColorPickerField,
  rating: RatingField,
};
```

In your PHP field definition:

```php
<?php
Field::custom('rating')
    ->component('rating');
```

This will make the system look for the `rating` key in the registry above and
render the `RatingField` component.

---

## Database Casting

If you want to store the custom field value in the database, add a cast in your
Eloquent model:

```php
<?php
class Review extends Model
{
    protected $casts = [
        'rating' => 'integer',
    ];
}
```

---

## Basic Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Field;

Field::custom('rating')
    ->component('rating')
    ->label('Rating');
```

---

## Adding Extra Attributes

You can pass extra props to the component using `extraAttributes` or
`extraAttribute`:

```php
<?php
Field::custom('rating')
    ->component('rating')
    ->extraAttributes([
        'maxStars' => 10,
        'size' => 'lg',
        'activeColor' => '#16a34a', // green
    ]);
```

Or individually:

```php
<?php
Field::custom('rating')
    ->component('rating')
    ->extraAttribute('readonly', true);
```

---

## Initial State

Define the initial state for the field:

```php
<?php
Field::custom('rating')
    ->component('rating')
    ->state(3); // Default: 3 stars selected
```

---

## Format State

Transform the state before displaying:

```php
<?php
Field::custom('rating')
    ->component('rating')
    ->state(4)
    ->state(fn ($state) => $state . ' stars');
```

---

## Example RatingField Component

create file in `resources/js/components/builder/custom-fields/rating-field.tsx`.

```typescript
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingFieldProps {
    name: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    activeColor?: string;
    readonly?: boolean;
}

export function RatingField({
    label,
    value = 0,
    onChange,
    maxStars = 5,
    size = 'md',
    color = '#e5e7eb',
    activeColor = '#f59e0b',
    readonly = false,
}: RatingFieldProps) {
    const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const containerSizeClasses = {
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3',
    };

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    'flex items-center',
                    containerSizeClasses[size],
                    readonly ? 'opacity-70' : ''
                )}
            >
                {stars.map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={cn(
                            'focus:outline-none',
                            !readonly && 'hover:scale-110 transition-transform'
                        )}
                        onClick={() => !readonly && onChange(star)}
                        disabled={readonly}
                    >
                        <Star
                            className={sizeClasses[size]}
                            fill={star <= value ? activeColor : 'none'}
                            color={star <= value ? activeColor : color}
                            strokeWidth={1.5}
                        />
                    </button>
                ))}

                {!readonly && (
                    <button
                        type="button"
                        className="text-xs text-muted-foreground ml-2"
                        onClick={() => onChange(0)}
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                {value > 0 ? `Rated ${value} of ${maxStars} stars` : 'Not rated'}
            </div>
        </div>
    );
}
```

---

## API Reference

| Method                                      | Description                                               |
| ------------------------------------------- | --------------------------------------------------------- |
| `component(string $component)`              | Set the component to use (must match the key in index.ts) |
| `extraAttributes(array $attributes)`        | Pass multiple extra props to the component                |
| `extraAttribute(string $key, mixed $value)` | Pass a single extra prop                                  |
| `state(mixed $state)`                       | Define the initial state value                            |
| `state(Closure $callback)`                  | Transform the state before rendering                      |

---

## UI Preview Example (Concept)

```
Rating: ★★★☆☆ (3 of 5 stars)
[ Clear ]
```
