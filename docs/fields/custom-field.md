# CustomField

CustomField memungkinkan Anda mengintegrasikan komponen React Anda sendiri ke dalam sistem form Inertia. Fitur ini berguna untuk membuat tipe input yang tidak tersedia secara default, seperti rating selector, color picker, atau widget UI khusus lainnya.

---

## Cara Kerja

Custom field harus didaftarkan secara manual di  
`resources/js/components/custom-fields/index.ts`.

**Contoh:**
```typescript
import { ColorPickerField } from "./color-picker-field";
import { RatingField } from "./rating-field";

// Daftarkan semua komponen custom field di sini.
// Key (misal: 'rating') harus sesuai dengan nama yang digunakan di PHP.
export const customFieldsComponents: Record<string, React.ComponentType<any>> = {
    'color-picker': ColorPickerField,
    'rating': RatingField,
};
```

Di definisi field PHP Anda:
```php
Field::custom('rating')
    ->component('rating');
```
Ini akan membuat sistem mencari key `rating` pada registry di atas dan merender `RatingField`.

---

## Database Casting

Jika Anda ingin menyimpan nilai custom field ke database, lakukan casting di model Eloquent Anda:

```php
class Review extends Model
{
    protected $casts = [
        'rating' => 'integer',
    ];
}
```

---

## Penggunaan Dasar

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Field;

Field::custom('rating')
    ->component('rating')
    ->label('Rating');
```

---

## Menambahkan Atribut Ekstra

Anda dapat menambahkan props ekstra ke komponen menggunakan `extraAttributes` atau `extraAttribute`:

```php
Field::custom('rating')
    ->component('rating')
    ->extraAttributes([
        'maxStars' => 10,
        'size' => 'lg',
        'activeColor' => '#16a34a', // hijau
    ]);
```

Atau secara individual:
```php
Field::custom('rating')
    ->component('rating')
    ->extraAttribute('readonly', true);
```

---

## State Awal

Definisikan state awal untuk field:

```php
Field::custom('rating')
    ->component('rating')
    ->state(3); // Default: 3 bintang terpilih
```

---

## Format State

Transformasi state sebelum ditampilkan:

```php
Field::custom('rating')
    ->component('rating')
    ->state(4)
    ->formatStateUsing(fn ($state) => $state . ' stars');
```

---

## Contoh Komponen RatingField

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

| Method | Description |
| ------ | ----------- |
| `component(string $component)` | Set komponen yang digunakan (harus sesuai key di index.ts) |
| `extraAttributes(array $attributes)` | Kirim beberapa props ekstra ke komponen |
| `extraAttribute(string $key, mixed $value)` | Kirim satu prop ekstra |
| `state(mixed $state)` | Definisikan nilai state awal |
| `formatStateUsing(Closure $callback)` | Transformasi state sebelum render |

---

## Contoh UI Preview (Konsep)

```
Rating: ★★★☆☆ (3 of 5 stars)
[ Clear ]
```
