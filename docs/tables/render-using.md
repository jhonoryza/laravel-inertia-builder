# Column Rendering (`renderUsing`)

By default, a table column only displays the raw value from the database.
If you want to customize the display (for example, modify raw value, show a html link, badge, or other react UI component), use the `renderUsing()` method.

---

## Render with modified raw value

If you want to render a cell with custom display

```php
->renderUsing(function($state) {
    return ucwords($state);
})
```

## Render with Raw HTML

Besides components, a cell can also be rendered with raw HTML using the `__html` key:

```php
TableColumn::make('link')
    ->label('Website')
    ->renderUsing(function ($value) {
        return [
            "__html" => "<a href=\"$value\" class=\"hover:text-ring\" target=\"_blank\">$value</a>"
        ];
    });
```

Result:

```html
<a href="https://example.com" class="hover:text-ring" target="_blank">
  https://example.com
</a>
```

## Render with custom React Component

If you want to render a cell using a registered React component:

```php
TableColumn::make('status')
    ->label('Status')
    ->renderUsing(fn ($value) => [
        'component' => 'badge',
        'props' => [
            'value' => ucfirst($value),
            'variant' => $value === 'active' ? 'success' : 'danger',
        ],
    ]);
```

In the example above:

- `component`: the name of the component registered in the frontend.
- `props`: properties to pass to the component.

Rendered result example:

```tsx
<BadgeCell value="Active" variant="success" />
```

### Component Registration

All custom cell components must be registered in:

`resources/js/components/builder/custom-cell/index.ts`

```ts
// Register all custom cell components here.
// The key (e.g., 'badge') is the name used in backend (PHP).

import BadgeCell from "./badge-cell";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customCellComponents: Record<string, React.ComponentType<any>> = {
    'badge': BadgeCell,
};
```

example `badge cell component` create file in `resources/js/components/builder/custom-cell/badge-cell.tsx`

```tsx
import { Badge } from "@/components/ui/badge"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface BadgeCellProps {
  value: string | number | null | undefined
  variant?: BadgeVariant
}

export default function BadgeCell({ value, variant = "default" }: BadgeCellProps) {
  if (!value) return null

  return (
    <Badge variant={variant} className="capitalize">
      {value}
    </Badge>
  )
}
```

---
