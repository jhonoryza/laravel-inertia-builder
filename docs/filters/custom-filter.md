# Custom Filters

Custom filters allow you to create interactive and reusable filter components, beyond the built-in filters.

Custom filters are defined as **flat JSON objects** sent from the backend (Laravel) to the frontend (React).

On the backend, each filter inherits from `AbstractFilter` and can define or override the available **operators**.
On the frontend, you provide a custom React component and register it for dynamic usage.

---

## Backend (Laravel)

### Example: Rating Filter

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Enums\Operator;

Filter::make('rating')
    ->label('Rating')
    ->component('rating') // must match the React component key
    ->operators([
        Operator::equals(),
        Operator::greaterThan(),
    ]);
```

**Explanation:**
- `make('rating')` → filter key (field name).
- `label('Rating')` → display label.
- `component('rating')` → React component name registered in the frontend.
- `operators([...])` → override default operators.

---

## Frontend (React)

### 1. Create the Filter Component

Build a filter component as needed.

```tsx
// resources/js/components/custom-filters/rating-filter.tsx
import React from "react";
import { RatingField } from "@/components/custom-fields/rating-field";

export type CustomFilterComponentProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  filterDef: {
    field: string;
    label: string;
    type: string;
    operators: string[];
    component?: string;
  };
};

export function RatingFilter({ value, onChange, filterDef }: CustomFilterComponentProps) {
  return (
    <RatingField
      name={filterDef.field}
      label={filterDef.label}
      value={Number(value) || 0}
      onChange={(newValue) => onChange(String(newValue))}
    />
  );
}
```

**Props:**
- `value` → current filter value.
- `onChange` → callback to update the value.
- `filterDef` → filter metadata (field, label, operator, etc).

---

### 2. Register the Component

Register all custom filters for dynamic usage.

```ts
// resources/js/components/custom-filters/index.ts
import React from "react";
import { RatingFilter } from "@/components/custom-filters/rating-filter";

// The key must match the name in backend `component()`
export const customFilterComponents: Record<string, React.ComponentType<any>> = {
  rating: RatingFilter,
};
```
