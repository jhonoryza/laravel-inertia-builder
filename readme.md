# Laravel Inertia React UI Builder

This project is inspired by Filament PHP. It aims to build complex UI components like data tables and forms using a
declarative, backend-driven approach. The structure of the UI (e.g., form fields, table columns) is defined in PHP
controller classes, and a generic set of React components renders the final UI. The goal is to build dynamic interfaces
without writing custom frontend page components for each resource.

**Key Technologies:** Laravel, Inertia.js, React, TypeScript, TailwindCSS.

---

## Reactive Forms (The Inertia Way)

The form builder supports creating fields that react to changes in other fields. This is achieved without custom
frontend logic or API endpoints by using Inertia's "Partial Reloads" feature. This allows any field's properties (
options, value, label, visibility, etc.) to be updated dynamically from the backend.

### How It Works

1. **Backend (Marking a Field as Reactive):** In a controller, call the `.reactive()` method on any field that should
   trigger an update when its value changes.
   ```php
   Field::select('province_id')->reactive()
   ```

2. **Frontend (Triggering the Reload):** The `app-field-builder.tsx` component detects if a field is marked as
   `reactive`. When the user changes the value of that field, it automatically makes an Inertia partial visit to the
   current URL, sending the new value and requesting only the `fields` prop back.
   ```javascript
   router.get(currentUrl, { province_id: 'new-value' }, { only: ['fields'], ... });
   ```

3. **Backend (Handling the Reload):** The controller method (e.g., `create(Request $request)`) receives the partial
   reload request. It uses the value from the `$request` (e.g., `$request->input('province_id')`) to dynamically build a
   new `fields` array with updated options or values.

4. **Frontend (Seamless Update):** Inertia receives the updated `fields` prop and seamlessly updates the form,
   preserving the user's other input and scroll position.

This architecture keeps the frontend components generic and moves all state logic to the Laravel backend where it
belongs.

---

## Backend (Laravel)

1. `Jhonoryza/InertiaBuilder/Inertia/Fields`, This directory contains the PHP classes for the **Form Builder**. Each class (e.g., `TextField`, `SelectField`)
represents a type of form field. They are used in controllers to define the form's structure.

2. `Jhonoryza/InertiaBuilder/Inertia/Tables`, This directory contains the PHP classes for the **Datatable Builder**. It's used to define the columns, filters, and
actions for data tables.

3. `Jhonoryza/InertiaBuilder/Inertia/Tables/Filters`, Contains the specific PHP classes for defining filters used within the Datatable Builder.

---

## Frontend (React Inertia)

1. `resources/js/pages`, This is a critical folder containing the Inertia page components. These components receive the UI definition (e.g., an
array of fields) from the Laravel controllers as props. They host the builder components. For example,
`pages/districts/create.tsx` would render a form based on the fields defined in `DistrictController`.

2. `resources/js/components/builder`, This folder contains all reusable generic inertia builder components.

3. `resources/js/components/custom-fields`, This folder contains all reusable custom field components.

4. `resources/js/components/custom-fields`, This folder contains all reusable custom filter components.

5. `resources/js/pages/builder`, This folder contains all reusable create, view, edit, and index components.

6. `resources/js/types`, Contains all TypeScript type definitions.

---

## Examples

more examples check this [docs](./docs/index.md)