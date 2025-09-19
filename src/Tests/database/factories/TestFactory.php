<?php

namespace Database\Factories;

use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestFactory extends Factory
{
    protected $model = Test::class;

    public function definition(): array
    {
        return [
            'text'                   => $this->faker->word(),
            'reactive'               => $this->faker->word(),
            'password'               => bcrypt('password'),
            'email'                  => $this->faker->unique()->safeEmail(),
            'number'                 => $this->faker->word(),
            'textarea'               => $this->faker->word(),
            'rich'                   => $this->faker->word(),
            'markdown'               => $this->faker->word(),
            'date'                   => $this->faker->date(),
            'datetime'               => $this->faker->dateTime(),
            'fp_date'                => $this->faker->date(),
            'fp_datetime'            => $this->faker->dateTime(),
            'keyvalue'               => $this->faker->word(),
            'toggle'                 => $this->faker->boolean(),
            'radio'                  => $this->faker->word(),
            'checkbox'               => $this->faker->word(),
            'checkboxlist'           => $this->faker->word(),
            'tags'                   => $this->faker->word(),
            'file'                   => $this->faker->word(),
            'repeater'               => $this->faker->word(),
            'rating'                 => $this->faker->word(),
            'single_select'          => $this->faker->word(),
            'multiple_select'        => $this->faker->word(),
            'single_select_search'   => $this->faker->word(),
            'multiple_select_search' => $this->faker->word(),
            'single_combobox'        => $this->faker->word(),
            'multiple_combobox'      => $this->faker->word(),
            'user_id'                => \App\Models\User::factory(),
        ];
    }
}
