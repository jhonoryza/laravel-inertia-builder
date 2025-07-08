<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory;

use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\BooleanFilter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\CustomFilter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\DateFilter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\NumberFilter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\SelectFilter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\TextFilter;

class Filter
{
    /**
     * Create a text filter
     */
    public static function text(string $field): TextFilter
    {
        return TextFilter::make($field);
    }

    /**
     * Create an boolean filter
     */
    public static function boolean(string $field): BooleanFilter
    {
        return BooleanFilter::make($field);
    }

    /**
     * Create a number filter
     */
    public static function number(string $field): NumberFilter
    {
        return NumberFilter::make($field);
    }

    /**
     * Create a date filter
     */
    public static function date(string $field): DateFilter
    {
        return DateFilter::make($field);
    }

    /**
     * Create a select filter
     */
    public static function select(string $field): SelectFilter
    {
        return SelectFilter::make($field);
    }

    /**
     * Create a custom filter
     */
    public static function custom(string $field): CustomFilter
    {
        return CustomFilter::make($field);
    }
}
