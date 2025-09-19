<?php

namespace App\Builder\Tables;

use App\Models\Test;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class TestTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(Test::class)
            ->columns([
                TableColumn::make('id')
                    ->sortable(),
                TableColumn::make('text')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('reactive')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('password')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('email')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('number')
                    ->searchable()
                    ->sortable(),
                // TableColumn::make('textarea')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('rich')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('markdown')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('date')
                //     ->renderUsing(function ($value) {
                //         return $value
                //             ?->format('d/m/Y') ?? '';
                //     })
                //     ->sortable(),
                // TableColumn::make('datetime')
                //     ->renderUsing(function ($value) {
                //         return $value
                //             ?->format('d/m/Y H:i') ?? '';
                //     })
                //     ->sortable(),
                // TableColumn::make('fp_date')
                //     ->renderUsing(function ($value) {
                //         return $value
                //             ?->format('d/m/Y') ?? '';
                //     })
                //     ->sortable(),
                // TableColumn::make('fp_datetime')
                //     ->renderUsing(function ($value) {
                //         return $value
                //             ?->format('d/m/Y H:i') ?? '';
                //     })
                //     ->sortable(),
                // TableColumn::make('keyvalue')
                //     ->sortable(),
                // TableColumn::make('toggle')
                //     ->renderUsing(function ($value) {
                //         return $value ? 'Yes' : 'No';
                //     })
                //     ->sortable(),
                // TableColumn::make('radio')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('checkbox')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('checkboxlist')
                //     ->sortable(),
                // TableColumn::make('tags')
                //     ->sortable(),
                // TableColumn::make('file')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('repeater')
                //     ->sortable(),
                // TableColumn::make('rating')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('single_select')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('multiple_select')
                //     ->sortable(),
                // TableColumn::make('single_select_search')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('multiple_select_search')
                //     ->sortable(),
                // TableColumn::make('single_combobox')
                //     ->searchable()
                //     ->sortable(),
                // TableColumn::make('multiple_combobox')
                //     ->sortable(),
                // TableColumn::make('user.name')
                //     ->label('User')
                //     ->sortable(),
                // TableColumn::make('created_at')
                //     ->renderUsing(function ($value) {
                //         return $value
                //             ?->format('d/m/Y H:i') ?? '';
                //     })
                //     ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('text'),
                Filter::text('reactive'),
                Filter::text('password'),
                Filter::text('email'),
                Filter::text('number'),
                Filter::text('textarea'),
                Filter::text('rich'),
                Filter::text('markdown'),
                Filter::date('date'),
                Filter::date('datetime'),
                Filter::date('fp_date'),
                Filter::date('fp_datetime'),
                Filter::boolean('toggle'),
                Filter::text('radio'),
                Filter::text('checkbox'),
                Filter::text('file'),
                Filter::text('rating'),
                Filter::text('single_select'),
                Filter::text('single_select_search'),
                Filter::text('single_combobox'),
                Filter::select('user_id')
                    ->label('User')
                    ->relationship(User::class, 'name', 'name')
                    ->query(fn ($query, $op, $val) => $query->whereHas('user', function ($q) use ($op, $val) {
                        $q->where('name', $op, $val);
                    })),
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
        $ids    = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('tests.create');
            case 'delete':
                Test::destroy($ids);

                return redirect()
                    ->route('tests.index')
                    ->with('success', 'Items ' . collect($ids)->implode(', ') . ' deleted successfully.');
            case 'export':
                $fileName = 'export_' . now()->format('Ymd_His') . '.csv';
                $fileUrl  = Storage::url($fileName);
                $filePath = storage_path('app/public/' . $fileName);

                static::build()
                    ->disablePagination()
                    ->export($filePath);

                return redirect()
                    ->route('tests.index', request()->query())
                    ->with('success', 'exported data successfully.')
                    ->with('link', $fileUrl);
            default:
                return redirect()
                    ->route('tests.index')
                    ->with('failed', 'undefined action.');
        }
    }
}
