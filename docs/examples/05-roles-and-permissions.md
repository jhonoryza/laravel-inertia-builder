# Example Roles and Permissions

this example will use `spatie/permission` package

install `composer require spatie/laravel-permission` and run `php artisan migrate`

then generate roles and permissions with generator scaffolding

```bash
php artisan inertia-builder:generate roles
php artisan inertia-builder:generate permissions
```

add `Permission` Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as ModelsPermission;

class Permission extends ModelsPermission
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guard_name',
    ];

    protected function casts(): array
    {
        return [

        ];
    }
}
```

add `PermissionTable`

```php
<?php

namespace App\Builder\Tables;

use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class PermissionTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(Permission::class)
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
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('guard_name'),
            ])
            ->defaultSort('id', 'asc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->label('Batch Delete')
                    ->message('Are you sure to delete multiple row?'),
            ]);
    }

    public static function actions(): RedirectResponse
    {
        $action = request()->get('action');
        $ids = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('permissions.create');
            case 'delete':
                Permission::destroy($ids);

                return redirect()
                    ->route('permissions.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('permissions.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```

add `PermissionForm`

```php
<?php

namespace App\Builder\Forms;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class PermissionForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->view()
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('name')
                    ->info(),
                Field::text('guard_name')
                    ->info(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::make(static::class)
            ->edit()
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('name'),
                Field::text('guard_name'),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->create()
            ->model(new Permission)
            ->columns(1)
            ->schema([
                Field::text('name'),
                Field::text('guard_name'),
            ]);
    }
}
```

add `PermissionController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Builder\Forms\PermissionForm;
use App\Builder\Tables\PermissionTable;
use App\Http\Requests\PermissionStoreRequest;
use App\Http\Requests\PermissionUpdateRequest;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('builder/index', [
            'data' => PermissionTable::build(),
        ]);
    }

    public function actions(): RedirectResponse
    {
        return PermissionTable::actions();
    }

    public function show(Permission $permission): Response
    {
        return Inertia::render('builder/show', [
            'form' => PermissionForm::view($permission),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => PermissionForm::create(),
        ]);
    }

    public function edit(Permission $permission): Response
    {
        return Inertia::render('builder/edit', [
            'form' => PermissionForm::edit($permission),
        ]);
    }

    public function store(PermissionStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $permission = Permission::create($data);

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Item '.$permission->id.' created successfully.');
    }

    public function update(PermissionUpdateRequest $request, Permission $permission): RedirectResponse
    {
        $data = $request->validated();
        $permission->update($data);

        return redirect()
            ->route('permissions.edit', $permission)
            ->with('success', 'Item '.$permission->id.' updated successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Item '.$permission->id.' deleted successfully.');
    }
}

```

add `Role` model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as ModelsRole;

class Role extends ModelsRole
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guard_name',
    ];

    protected function casts(): array
    {
        return [

        ];
    }
}
```

add `RoleTable` class

```php
<?php

namespace App\Builder\Tables;

use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class RoleTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(Role::class)
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
                    ->renderUsing(function ($model) {
                        return $model->permissions()->count();
                    }),
                TableColumn::make('created_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('guard_name'),
            ])
            ->defaultSort('id', 'asc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->label('Batch Delete')
                    ->message('Are you sure to delete multiple row?'),
            ]);
    }

    public static function actions(): RedirectResponse
    {
        $action = request()->get('action');
        $ids = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('roles.create');
            case 'delete':
                Role::destroy($ids);

                return redirect()
                    ->route('roles.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('roles.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```

add `RoleForm` class

```php
<?php

namespace App\Builder\Forms;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class RoleForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->view()
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('name')
                    ->info(),
                Field::text('guard_name')
                    ->info(),
                Field::checkboxList('permissions')
                    ->defaultValue($state?->permissions->pluck('id')->toArray())
                    ->loadOptionsUsing(function () use ($state) {
                        return $state?->permissions()->get();
                    })
                    ->disable(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::make(static::class)
            ->edit()
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('name'),
                Field::text('guard_name'),
                Field::select('permissions')
                    ->state($state?->permissions->pluck('id')->toArray())
                    ->loadOptionsUsing(function () {
                        return Permission::query();
                    })
                    ->multiple()
                    ->searchable(),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->create()
            ->model(new Role)
            ->columns(1)
            ->schema([
                Field::text('name'),
                Field::text('guard_name'),
                Field::select('permissions')
                    ->loadOptionsUsing(function () {
                        return Permission::query();
                    })
                    ->multiple()
                    ->searchable(),
            ]);
    }
}
```

add `RoleController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Builder\Forms\RoleForm;
use App\Builder\Tables\RoleTable;
use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('builder/index', [
            'data' => RoleTable::build(),
        ]);
    }

    public function actions(): RedirectResponse
    {
        return RoleTable::actions();
    }

    public function show(Role $role): Response
    {
        return Inertia::render('builder/show', [
            'form' => RoleForm::view($role),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => RoleForm::create(),
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('builder/edit', [
            'form' => RoleForm::edit($role),
        ]);
    }

    public function store(RoleStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $role = Role::create($data);
        $role->syncPermissions($request->input('permissions'));

        return redirect()
            ->route('roles.index')
            ->with('success', 'Item '.$role->id.' created successfully.');
    }

    public function update(RoleUpdateRequest $request, Role $role): RedirectResponse
    {
        $data = $request->validated();
        $role->update($data);
        $role->syncPermissions($request->input('permissions'));

        return redirect()
            ->route('roles.edit', $role)
            ->with('success', 'Item '.$role->id.' updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Item '.$role->id.' deleted successfully.');
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

use App\Builder\Forms\UserForm;
use App\Builder\Tables\UserTable;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('builder/index', [
            'data' => UserTable::build(),
        ]);
    }

    public function actions(): RedirectResponse
    {
        return UserTable::actions();
    }

    public function show(User $user): Response
    {
        return Inertia::render('builder/show', [
            'form' => UserForm::view($user),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => UserForm::create(),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('builder/edit', [
            'form' => UserForm::edit($user),
        ]);
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = User::create($data);
        $user->syncRoles((int)$request->role);

        return redirect()
            ->route('users.index')
            ->with('success', 'Item '.$user->id.' created successfully.');
    }

    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        $user->update($data);
        $user->syncRoles((int)$request->role);

        return redirect()
            ->route('users.edit', $user)
            ->with('success', 'Item '.$user->id.' updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'Item '.$user->id.' deleted successfully.');
    }
}
```

then try assign the user a role using the ui

`User` model

```php
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roleId(): int|string
    {
        return $this->roles->first()->id ?? '';
    }
}
```

add `UserForm`

```php
<?php

namespace App\Builder\Forms;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;

class UserForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->view()
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('name')
                    ->info(),
                Field::text('email')
                    ->info(),
                Field::text('email_verified_at')
                    ->info(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::make(static::class)
            ->edit()
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('name'),
                Field::text('email'),
                Field::select('role')
                    ->defaultValue($state?->roleId())
                    ->loadOptionsUsing(function () {
                        return Role::query();
                    }),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->create()
            ->model(new User)
            ->columns(1)
            ->schema([
                Field::text('name'),
                Field::text('email'),
                Field::text('password'),
                Field::select('role')
                    ->loadOptionsUsing(function () {
                        return Role::query();
                    }),
            ]);
    }
}
```

add `UserTable`

```php
<?php

namespace App\Builder\Tables;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class UserTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(User::class)
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
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('email'),
            ])
            ->defaultSort('id', 'asc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->label('Batch Delete')
                    ->message('Are you sure to delete multiple row?'),
            ]);
    }

    public static function actions(): RedirectResponse
    {
        $action = request()->get('action');
        $ids = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('users.create');
            case 'delete':
                User::destroy($ids);

                return redirect()
                    ->route('users.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('users.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
```
