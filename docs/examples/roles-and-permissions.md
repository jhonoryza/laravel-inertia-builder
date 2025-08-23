# Example Roles and Permissions

this example will use `spatie/permission` package

install `composer require spatie/laravel-permission` and run `php artisan migrate`

then generate roles and permissions with generator scaffolding

```bash
php artisan inertia-builder:generate roles
php artisan inertia-builder:generate permissions
```

edit `PermissionController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionStoreRequest;
use App\Http\Requests\PermissionUpdateRequest;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(Permission::class)
            ->columns([
                TableColumn::make('id')
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('guard_name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('created_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('guard_name'),
            ])
            ->defaultSort('id', 'desc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this item?'),
            ]);

        return Inertia::render('builder/index', [
            'data' => $table,
            'routeName' => 'permissions',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('permissions.create');
            case 'delete':
                Permission::destroy($ids);

                return redirect()
                    ->route('permissions.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('permissions.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getForm(?Permission $permission = null, $disable = false)
    {
        return Form::make()
            ->fields([
                Field::text('name')
                    ->defaultValue($permission?->name)
                    ->disable($disable),
                Field::text('guard_name')
                    ->defaultValue($permission?->guard_name)
                    ->disable($disable),
        ]);
    }

    public function show(Permission $permission): Response
    {
        return Inertia::render('builder/show', [
            'form' => $this->getForm($permission, true),
            'routeName' => 'permissions',
            'routeId' => $permission->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => $this->getForm(),
            'routeName' => 'permissions',
        ]);
    }

    public function edit(Permission $permission): Response
    {
        return Inertia::render('builder/edit', [
            'form' => $this->getForm($permission),
            'routeName' => 'permissions',
            'routeId' => $permission->id,
        ]);
    }

    public function store(PermissionStoreRequest $request): RedirectResponse
    {
        $item = Permission::create($request->validated());

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Item created successfully.');
    }

    public function update(PermissionUpdateRequest $request, Permission $permission): RedirectResponse
    {
        $permission->update($request->validated());

        return redirect()
            ->route('permissions.edit', $permission)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Item deleted successfully.');
    }
}
```

edit `RoleController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class RoleController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(Role::class)
            ->columns([
                TableColumn::make('id')
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('guard_name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('permissions')
                    ->hasMany('permissions', 'name')
                    ->renderUsing(function ($value, $role) {
                        return $role->permissions->count();
                    }),
                TableColumn::make('created_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('guard_name'),
            ])
            ->defaultSort('id', 'desc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this item?'),
            ]);

        return Inertia::render('builder/index', [
            'data' => $table,
            'routeName' => 'roles',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('roles.create');
            case 'delete':
                Role::destroy($ids);

                return redirect()
                    ->route('roles.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('roles.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getForm(?Role $role = null, $disable = false)
    {
        return Form::make()
            ->fields([
                Field::text('name')
                    ->defaultValue($role?->name)
                    ->disable($disable),
                Field::text('guard_name')
                    ->defaultValue($role?->guard_name)
                    ->disable($disable),
                Field::select('permissions')
                    ->defaultValue($role?->permissions->pluck('id')->toArray())
                    ->loadOptionsUsing(function () {
                        return Permission::query();
                    })
                    ->multiple()
                    ->searchable()
                    ->hidden($disable),
                Field::checkboxList('permissions')
                    ->defaultValue($role?->permissions->pluck('id')->toArray())
                    ->loadOptionsUsing(function () use ($role) {
                        return $role?->permissions()->get();
                    })
                    ->hidden(!$disable),
        ]);
    }

    public function show(Role $role): Response
    {
        return Inertia::render('builder/show', [
            'form' => $this->getForm($role, true),
            'routeName' => 'roles',
            'routeId' => $role->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => $this->getForm(),
            'routeName' => 'roles',
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('builder/edit', [
            'form' => $this->getForm($role),
            'routeName' => 'roles',
            'routeId' => $role->id,
        ]);
    }

    public function store(RoleStoreRequest $request): RedirectResponse
    {
        $item = DB::transaction(function () use ($request) {
            $item = Role::create($request->validated());
            $item->syncPermissions($request->input('permissions'));
            return $item;
        });

        return redirect()
            ->route('roles.index')
            ->with('success', 'Item created successfully.');
    }

    public function update(RoleUpdateRequest $request, Role $role): RedirectResponse
    {
        DB::transaction(function () use ($request, $role) {
            $role->update($request->validated());

            $role->syncPermissions($request->input('permissions'));
        });

        return redirect()
            ->route('roles.edit', $role)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Item deleted successfully.');
    }
}
```

try create new permission using the ui 

- users index
- users show
- users create
- users edit
- users destroy

edit `UserController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use Spatie\Permission\Models\Role;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('can:users index', only: ['index']),
            new Middleware('can:users show', only: ['show']),
            new Middleware('can:users create', only: ['create', 'store']),
            new Middleware('can:users edit', only: ['edit', 'update']),
            new Middleware('can:users destroy', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $table = Table::make(User::class)
            ->columns([
                TableColumn::make('id')
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('email')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('roles.name'),
                TableColumn::make('created_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('email'),
                Filter::date('email_verified_at'),
            ])
            ->defaultSort('id', 'desc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this item?'),
            ]);

        return Inertia::render('builder/index', [
            'data' => $table,
            'routeName' => 'users',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('users.create');
            case 'delete':
                if (!Gate::allows('users destroy')) {
                    abort(403);
                }
                User::destroy($ids);

                return redirect()
                    ->route('users.index')
                    ->with('success', 'Items deleted successfully.');
            default:
                return redirect()
                    ->route('users.index')
                    ->with('failed', 'undefined action.');
        }
    }

    private function getForm(?User $user = null, $disable = false)
    {
        return Form::make()
            ->fields([
                Field::text('name')
                    ->defaultValue($user?->name)
                    ->disable($disable),
                Field::text('email')
                    ->defaultValue($user?->email)
                    ->disable($disable),
                Field::select('role')
                    ->defaultValue($user?->roleId())
                    ->loadOptionsUsing(function () {
                        return Role::query();
                    }),
                Field::password('password')
                    ->hidden($disable),
                Field::password('password_confirmation')
                    ->hidden($disable),
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('builder/show', [
            'form' => $this->getForm($user, true),
            'routeName' => 'users',
            'routeId' => $user->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => $this->getForm(),
            'routeName' => 'users',
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('builder/edit', [
            'form' => $this->getForm($user),
            'routeName' => 'users',
            'routeId' => $user->id,
        ]);
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $item = User::create($request->validated());

        return redirect()
            ->route('users.index')
            ->with('success', 'Item created successfully.');
    }

    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        DB::transaction(function () use ($user, $request) {
            $data = $request->except('password');
            if ($request->filled('password')) {
                $request->merge(['password' => Hash::make($request->password)]);
                $data = $request->validated();
            }
            $user->update($data);
            $user->syncRoles((int)$request->role);
        });

        return redirect()
            ->route('users.edit', $user)
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'Item deleted successfully.');
    }
}
```

then try assign the user a role using the ui 