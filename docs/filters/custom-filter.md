# Custom Filters

Custom filters memungkinkan Anda membuat komponen filter yang interaktif dan dapat digunakan ulang, melampaui filter bawaan.

Custom filter didefinisikan sebagai **objek JSON satu dimensi** yang dikirim dari backend (Laravel) ke frontend (React).

Pada backend, setiap filter mewarisi `AbstractFilter` dan dapat mendefinisikan atau menimpa **operator** yang tersedia.  
Pada frontend, Anda menyediakan komponen React khusus dan mendaftarkannya agar dapat digunakan secara dinamis.

---

## Backend (Laravel)

### Contoh: Rating Filter

```php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Enums\Operator;

Filter::make('rating')
    ->label('Rating')
    ->component('rating') // harus sama dengan key komponen React
    ->operators([
        Operator::equals(),
        Operator::greaterThan(),
    ]);
```

**Penjelasan:**
- `make('rating')` → key filter (nama field).
- `label('Rating')` → label tampilan.
- `component('rating')` → nama komponen React yang didaftarkan di frontend.
- `operators([...])` → menimpa operator bawaan.

---

## Frontend (React)

### 1. Membuat Komponen Filter

Buat komponen filter sesuai kebutuhan Anda.

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
- `value` → nilai filter saat ini.
- `onChange` → callback untuk memperbarui nilai.
- `filterDef` → metadata filter (field, label, operator, dll).

---

### 2. Mendaftarkan Komponen

Daftarkan semua custom filter agar dapat digunakan secara dinamis.

```ts
// resources/js/components/custom-filters/index.ts
import React from "react";
import { RatingFilter } from "@/components/custom-filters/rating-filter";

// Key harus sama dengan nama pada backend `component()`
export const customFilterComponents: Record<string, React.ComponentType<any>> = {
  rating: RatingFilter,
};
```