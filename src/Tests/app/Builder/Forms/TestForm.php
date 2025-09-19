<?php

namespace App\Builder\Forms;

use App\Models\Test;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Set;
use Jhonoryza\InertiaBuilder\Inertia\Grids\Grid;

class TestForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::view(static::class)
            ->model($state)
            ->columns(1)
            ->schema([
                Field::text('text')
                    ->info(),
                Field::text('reactive')
                    ->info(),
                Field::text('password')
                    ->info(),
                Field::text('email')
                    ->info(),
                Field::text('number')
                    ->info(),
                Field::text('textarea')
                    ->info(),
                Field::text('rich')
                    ->info(),
                Field::text('markdown')
                    ->info(),
                Field::text('date')
                    ->info(),
                Field::text('datetime')
                    ->info(),
                Field::text('fp_date')
                    ->info(),
                Field::text('fp_datetime')
                    ->info(),
                Field::text('keyvalue')
                    ->info(),
                Field::text('toggle')
                    ->info(),
                Field::text('radio')
                    ->info(),
                Field::text('checkbox')
                    ->info(),
                Field::text('checkboxlist')
                    ->info(),
                Field::text('tags')
                    ->info(),
                Field::text('file')
                    ->info(),
                Field::text('repeater')
                    ->info(),
                Field::text('rating')
                    ->info(),
                Field::text('single_select')
                    ->info(),
                Field::text('multiple_select')
                    ->info(),
                Field::text('single_select_search')
                    ->info(),
                Field::text('multiple_select_search')
                    ->info(),
                Field::text('single_combobox')
                    ->info(),
                Field::text('multiple_combobox')
                    ->info(),
                Field::text('user_id')
                    ->info(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::edit(static::class)
            ->model($state)
            ->columns(1)
            ->schema([
                Grid::make()
                    ->columns(2)
                    ->schema([
                        Field::text('text')
                            ->prefix('gg.')
                            ->suffix('@mail')
                            ->reactive()
                            ->afterStateUpdated(fn (Set $set, $state) => $set('reactive', Str::slug($state))),
                        Field::text('reactive')
                            ->copyable(),
                        Field::password('password'),
                        Field::email('email'),
                        Field::number('number'),
                        Field::textarea('textarea'),

                    ]),
                Grid::make()
                    ->columns(2)
                    ->schema([
                        Field::richText('rich'),
                        Field::markdown('markdown'),

                    ]),
                Grid::make()
                    ->columns(2)
                    ->schema([
                        Field::date('date'),
                        Field::datetimeLocal('datetime'),
                        Field::flatpickr('fp_date')->date(),
                        Field::flatpickr('fp_datetime'),
                    ]),
                Field::keyValue('keyvalue'),
                Grid::make()
                    ->columns(2)
                    ->schema([
                        Field::toggle('toggle'),
                        Field::radio('radio')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                        Field::checkbox('checkbox'),
                        Field::checkboxList('checkboxlist')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),

                    ]),
                Field::tags('tags'),
                Field::file('file'),
                Field::repeater('repeater')
                    ->schema([
                        Field::text('arena'),
                        Field::checkboxList('rings')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                    ]),
                Field::custom('rating')
                    ->component('rating'),
                Grid::make()
                    ->columns(2)
                    ->schema([
                        Field::select('single_select')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                        Field::select('multiple_select')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->multiple(),
                        Field::select('single_select_search')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->searchable(),
                        Field::select('multiple_select_search')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->multiple()
                            ->searchable(),
                        Field::combobox('single_combobox')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                        Field::combobox('multiple_combobox')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->multiple(),
                    ]),
                Field::select('user_id')
                    ->label('User')
                    ->loadOptionsUsing(function () {
                        return User::query()
                            ->when(request('user_id_q'), function ($query, $value) {
                                $query->where('name', 'ilike', "%$value%");
                            })
                            ->limit(5);
                    })
                    ->serverside()
                    ->searchable(),
            ]);
    }

    public static function create(): Form
    {
        return Form::create(static::class)
            ->model(new Test)
            ->columns(1)
            ->schema([
                Field::text('text')
                    ->prefix('gg.')
                    ->suffix('@mail')
                    ->reactive()
                    ->afterStateUpdated(fn (Set $set, $state) => $set('reactive', Str::slug($state))),
                Field::text('reactive')
                    ->copyable(),
                Field::password('password'),
                Field::email('email'),
                Field::number('number'),
                Field::textarea('textarea'),
                Field::richText('rich'),
                Field::markdown('markdown'),
                Field::date('date'),
                Field::datetimeLocal('datetime'),
                Field::flatpickr('fp_date')->date(),
                Field::flatpickr('fp_datetime'),
                Field::keyValue('keyvalue'),
                Field::toggle('toggle'),
                Field::radio('radio')
                    ->options([
                        ['label' => 'a', 'value' => 'a'],
                        ['label' => 'b', 'value' => 'b'],
                    ]),
                Field::checkbox('checkbox'),
                Field::checkboxList('checkboxlist')
                    ->options([
                        ['label' => 'a', 'value' => 'a'],
                        ['label' => 'b', 'value' => 'b'],
                    ]),
                Field::tags('tags'),
                Field::file('file'),
                Field::repeater('repeater')
                    ->schema([
                        Field::text('arena'),
                        Field::checkboxList('rings')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                    ]),
                Field::custom('rating')
                    ->component('rating'),
                Grid::make()
                    ->columns(2)
                    ->schema([
                        Field::select('single_select')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                        Field::select('multiple_select')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->multiple(),
                        Field::select('single_select_search')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->searchable(),
                        Field::select('multiple_select_search')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->multiple()
                            ->searchable(),
                        Field::combobox('single_combobox')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ]),
                        Field::combobox('multiple_combobox')
                            ->options([
                                ['label' => 'a', 'value' => 'a'],
                                ['label' => 'b', 'value' => 'b'],
                            ])
                            ->multiple(),
                    ]),
                Field::select('user_id')
                    ->label('User')
                    ->loadOptionsUsing(function () {
                        return User::query()
                            ->when(request('user_id_q'), function ($query, $value) {
                                $query->where('name', 'ilike', "%$value%");
                            })
                            ->limit(5);
                    })
                    ->serverside()
                    ->searchable(),
            ]);
    }
}
