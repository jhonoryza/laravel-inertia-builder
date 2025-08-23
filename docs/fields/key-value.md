# KeyValueField

The `KeyValueField` allows you to manage a list of key → value pairs that can be added, edited, removed, and reordered.  
This field is useful for storing metadata, custom attributes, or any flexible configuration data.

---

## Introduction

The KeyValueField represents a one-dimensional JSON object, where each item is stored as a simple key => value pair.
This makes it ideal for storing metadata, custom settings, or flexible attributes on a model.

When saving to the database, you should cast the column to an array or JSON type to ensure the data is stored correctly.

---

## Database Casting

Make sure your model casts the attribute as an array (or JSON) in Laravel:

```php
class Post extends Model
{
    protected $casts = [
        'meta' => 'array',
    ];
}
```

---

## Basic Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Field;

Field::keyValue('meta');
```

By default, the field will display a key input and a value input, with labels **Key** and **Value**, an **Add Item** button, and placeholder texts.

---

## Configuration

You can customize the behavior of the field using method chaining.

### Disable adding new pairs

```php
Field::keyValue('meta')
    ->addable(false);
```

### Disable editing existing pairs

```php
Field::keyValue('meta')
    ->editable(false);
```

### Disable removing pairs

```php
Field::keyValue('meta')
    ->removable(false);
```

### Enable drag & drop reordering

```php
Field::keyValue('meta')
    ->reorderable(true);
```

---

## Labels & Placeholders

You can override the default labels and placeholders:

```php
Field::keyValue('meta')
    ->keyLabel('Attribute')
    ->valueLabel('Content')
    ->addButtonLabel('Add Attribute')
    ->keyPlaceholder('Enter attribute name')
    ->valuePlaceholder('Enter attribute value');
```

---

## API Reference

| Method                                   | Description                              | Default         |
| ----------------------------------------- | ---------------------------------------- | --------------- |
| `addable(bool $addable = true)`           | Allow adding new key-value pairs         | `true`          |
| `editable(bool $editable = true)`         | Allow editing existing pairs             | `true`          |
| `removable(bool $removable = true)`       | Allow removing pairs                     | `true`          |
| `reorderable(bool $reorderable = true)`   | Enable drag & drop reordering            | `false`         |
| `keyLabel(string $label)`                 | Set the label for the key column         | `Key`           |
| `valueLabel(string $label)`               | Set the label for the value column       | `Value`         |
| `addButtonLabel(string $label)`           | Set the label for the add button         | `Add Item`      |
| `keyPlaceholder(string $placeholder)`     | Set the placeholder for the key input    | `Enter key`     |
| `valuePlaceholder(string $placeholder)`   | Set the placeholder for the value input  | `Enter value`   |

---

## Data Output

The submitted data will be returned as an associative array of key-value pairs:

```php
[
    'title' => 'Hello World',
    'author' => 'John Doe',
]
```

---

## Example UI Preview (Concept)

Imagine the rendered UI looking like this:

```
+-------------------+-------------------+     [x]
| Key               | Value             |     Remove
+-------------------+-------------------+
| title             | Hello World       |
| author            | John Doe          |
+-------------------+-------------------+
[ Add Item ]
```

With placeholders applied:

```
+-------------------------+-------------------------+
| Attribute               | Content                 |
+-------------------------+-------------------------+
| Enter attribute name    | Enter attribute value   |
+-------------------------+-------------------------+
[ Add Attribute ]
```
