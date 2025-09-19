<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text'                   => ['required', 'string', 'min:1', 'max:255'],
            'reactive'               => ['required', 'string', 'min:1', 'max:255'],
            'password'               => ['required', 'string', 'min:1', 'max:255'],
            'email'                  => ['required', 'string', 'min:1', 'max:255'],
            'number'                 => ['required', 'int', 'min:1', 'max:9999999'],
            'textarea'               => ['required', 'string', 'min:1', 'max:255'],
            'rich'                   => ['required', 'string', 'min:1'],
            'markdown'               => ['required', 'string', 'min:1'],
            'date'                   => ['required', 'date'],
            'datetime'               => ['required', 'date'],
            'fp_date'                => ['required', 'date'],
            'fp_datetime'            => ['required', 'date'],
            'keyvalue'               => ['nullable'],
            'toggle'                 => ['nullable', 'boolean'],
            'radio'                  => ['required', 'string', 'min:1', 'max:255'],
            'checkbox'               => ['nullable', 'string', 'min:1', 'max:255'],
            'checkboxlist'           => ['nullable'],
            'tags'                   => ['nullable'],
            'file'                   => ['nullable'],
            'repeater'               => ['nullable'],
            'rating'                 => ['nullable', 'int', 'min:1', 'max:255'],
            'single_select'          => ['nullable', 'string', 'min:1', 'max:255'],
            'multiple_select'        => ['nullable'],
            'single_select_search'   => ['nullable', 'string', 'min:1', 'max:255'],
            'multiple_select_search' => ['nullable'],
            'single_combobox'        => ['nullable', 'string', 'min:1', 'max:255'],
            'multiple_combobox'      => ['nullable'],
            'user_id'                => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
