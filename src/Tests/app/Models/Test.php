<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Test extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'reactive',
        'password',
        'email',
        'number',
        'textarea',
        'rich',
        'markdown',
        'date',
        'datetime',
        'fp_date',
        'fp_datetime',
        'keyvalue',
        'toggle',
        'radio',
        'checkbox',
        'checkboxlist',
        'tags',
        'file',
        'repeater',
        'rating',
        'single_select',
        'multiple_select',
        'single_select_search',
        'multiple_select_search',
        'single_combobox',
        'multiple_combobox',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'keyvalue'               => 'array',
            'checkboxlist'           => 'array',
            'tags'                   => 'array',
            'repeater'               => 'array',
            'multiple_select'        => 'array',
            'multiple_select_search' => 'array',
            'multiple_combobox'      => 'array',
            'date'                   => 'date',
            'datetime'               => 'datetime',
            'fp_date'                => 'date',
            'fp_datetime'            => 'datetime',
            'toggle'                 => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {

        return $this->belongsTo(User::class);

    }
}
