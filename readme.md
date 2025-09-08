<h1 align="center">Laravel Inertia Builder</h1>
<p align="center">
    <a href="https://packagist.org/packages/jhonoryza/laravel-inertia-builder">
        <img src="https://poser.pugx.org/jhonoryza/laravel-inertia-builder/d/total.svg" alt="Total Downloads">
    </a>
    <a href="https://packagist.org/packages/jhonoryza/laravel-inertia-builder">
        <img src="https://poser.pugx.org/jhonoryza/laravel-inertia-builder/v/stable.svg" alt="Latest Stable Version">
    </a>
    <a href="https://packagist.org/packages/jhonoryza/laravel-inertia-builder">
        <img src="https://poser.pugx.org/jhonoryza/laravel-inertia-builder/license.svg" alt="License">
    </a>
</p>

This project is inspired by Filament PHP. It aims to build complex UI components like data tables and forms using a
declarative, backend-driven approach. The structure of the UI (e.g., form fields, table columns) is defined in PHP
controller classes, and a generic set of React components renders the final UI. The goal is to build dynamic interfaces
without writing custom frontend page components for each resource.

**Key Technologies:** Laravel, Inertia.js, React, TypeScript, TailwindCSS.

---

## Key Features

- **Declarative UI Construction:** Define forms and data tables in your Laravel controllers. No need to write bespoke
  frontend components for every CRUD page.
- **Rich Form Fields:** A wide variety of form fields are available out-of-the-box, including Text, Select, Textarea,
  Markdown, File Uploads, Date Pickers, and more.
- **Powerful Data Tables:** Create complex data tables with searchable columns, advanced filtering, sorting, and bulk
  actions.
- **Reactive Components:** Create reactive form elements where a change in one
  field automatically updates another, all handled seamlessly on the backend.
- **Relationship Handling:** Automatically populate fields and table columns with data from Eloquent relationships (
  `belongsTo`, `hasMany`, etc.).
- **Customizable:** Extend the library with your own custom fields and filters to meet specific needs.

---

## Docs

For more detailed examples and documentation, please check the following resources:

- **Tables:**
  - [Table Overview](./docs/tables/table.md)
  - [Table Column](./docs/tables/table-column.md)
  - [Table Column Render Using](./docs/tables/render-using.md)
- **Forms:**
  - [Form](./docs/forms/form.md)
- **Fields:**
  - [Text Field](./docs/fields/text.md)
  - [Email Field](./docs/fields/email.md)
  - [Number Field](./docs/fields/number.md)
  - [Password Field](./docs/fields/password.md)
  - [Textarea Field](./docs/fields/textarea.md)
  - [Grid Field](./docs/fields/grid.md)
  - [Slider Field](./docs/fields/slider.md)
  - [File Field](./docs/fields/file.md)
  - [Markdown Field](./docs/fields/markdown.md)
  - [Flatpickr Field](./docs/fields/flatpickr.md)
  - [Date & Datetime Field](./docs/fields/date-and-datetime.md)
  - [Hidden Field](./docs/fields/hidden.md)
  - [Toggle Field](./docs/fields/toggle.md)
  - [Radio Field](./docs/fields/radio.md)
  - [ComboBox Field](./docs/fields/combobox.md)
  - [Select Field](./docs/fields/select.md)
  - [Checkbox & CheckboxList Field](./docs/fields/checkbox.md)
- **Filters:**
  - [Text Filter](./docs/filters/text.md)
  - [Number Filter](./docs/filters/number.md)
  - [Boolean Filter](./docs/filters/boolean.md)
  - [Date Filter](./docs/filters/date.md)
  - [Select Filter](./docs/filters/select.md)
- **Examples:**
  - [CRUD Example: Provinces](./docs/examples/province.md)
  - [CRUD Example: Cities](./docs/examples/city.md)
  - [CRUD Example: Districts](./docs/examples/districts.md)
  - [CRUD Example: Subdistricts](./docs/examples/subdistricts.md)
  - [CRUD Example: Posts](./docs/examples/posts.md)
  - [CRUD Example: Role Permission](./docs/examples/roles-and-permissions.md)
  - [CRUD Example: Dropdown](./docs/examples/dependent-dropdown.md)

## Requirement

- PHP >= 8.4
- Laravel >= 12
- Nodejs >= 20
- Tailwind 4
- Laravel [official starter kit with React](https://laravel.com/docs/12.x/starter-kits#react)

currently not supported for `official vue starter kit`

## Getting Started

### Package installation

```bash
composer require jhonoryza/laravel-inertia-builder
```

```bash
php artisan inertia-builder:install
```

### Generator

you need at least a `table structure` in your database

let's create `users` table using `laravel migration` or `manual sql`

then run this command :

```bash
php artisan inertia-builder:generate users
```

this will generate: `Model, Factory, Controller, Form & Table class, Request, and Routes`

then run `npm run dev` to recompile the frontend

<!--## Core Concept: Reactive Forms (The Inertia Way)

The form builder supports creating fields that react to changes in other fields (e.g., dependent dropdowns). This is
achieved without custom frontend logic or API endpoints by using Inertia's "Partial Reloads" feature.

### How It Works

1. **Backend (Marking a Field as Reactive):** In a controller, call the `.reactive()` method on any field that should
   trigger an update when its value changes.
2. **Frontend (Triggering the Reload):** The generic field builder component detects if a field is `reactive`. When its
   value changes, it automatically makes an Inertia partial visit to the current URL, sending the new value.
3. **Backend (Handling the Reload):** The controller method (e.g., `create` or `edit`) receives the partial reload
   request. It uses the new value from the request to dynamically build a new `fields` array with updated options for
   other fields.
4. **Frontend (Seamless Update):** Inertia receives the updated `fields` prop and seamlessly updates the form,
   preserving the user's other input and scroll position.

----->

<!--## Project Structure

- **`src/Inertia/Fields`**: Contains the PHP classes for the **Form Builder** (e.g., `TextField`, `SelectField`).
- **`src/Inertia/Tables`**: Contains the PHP classes for the **Datatable Builder** (e.g., `Table`, `TableColumn`,
  `Filter`).
- **`resources/js/pages/builder`**: Contains the generic Inertia page components (`index.tsx`, `create.tsx`, `edit.tsx`)
  that render the UI based on props from the backend.
- **`resources/js/components/builder`**: Contains the reusable React components that make up the form and table
  builders (e.g., `app-datatable.tsx`, `app-form-builder.tsx`).-->

---

## Security

If you've found a bug regarding security, please mail [jardik.oryza@gmail.com](mailto:jardik.oryza@gmail.com) instead of
using the issue tracker.

## License

The MIT License (MIT). Please see [License File](license.md) for more information.
