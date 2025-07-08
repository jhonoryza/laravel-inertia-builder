<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Factory;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\CheckboxField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\CheckboxListField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\ComboBoxField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\CustomField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\DateField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\DatetimeLocalField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\EmailField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\FileField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\FlatpickrField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\HiddenField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\KeyValueField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\MarkdownField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\NumberField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\PasswordField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\RadioField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\RepeaterField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\RichTextField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\SelectField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\SliderField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\TagsField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\TextareaField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\TextField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\ToggleField;

/**
 * Factory class for creating specific field instances
 */
class Field
{
    /**
     * Create a text field
     */
    public static function text(string $name): TextField
    {
        return TextField::make($name);
    }

    /**
     * Create an email field
     */
    public static function email(string $name): EmailField
    {
        return EmailField::make($name);
    }

    /**
     * Create a number field
     */
    public static function number(string $name): NumberField
    {
        return NumberField::make($name);
    }

    /**
     * Create a password field
     */
    public static function password(string $name): PasswordField
    {
        return PasswordField::make($name);
    }

    /**
     * Create a flatpickr field
     */
    public static function flatpickr(string $name): FlatpickrField
    {
        return FlatpickrField::make($name);
    }

    /**
     * Create a textarea field
     */
    public static function textarea(string $name): TextareaField
    {
        return TextareaField::make($name);
    }

    /**
     * Create a date field
     */
    public static function date(string $name): DateField
    {
        return DateField::make($name);
    }

    /**
     * Create a datetime-local field
     */
    public static function datetimeLocal(string $name): DatetimeLocalField
    {
        return DatetimeLocalField::make($name);
    }

    /**
     * Create a markdown field
     */
    public static function markdown(string $name): MarkdownField
    {
        return MarkdownField::make($name);
    }

    /**
     * Create a select field
     */
    public static function select(string $name): SelectField
    {
        return SelectField::make($name);
    }

    /**
     * Create a combobox field
     */
    public static function combobox(string $name): ComboBoxField
    {
        return ComboBoxField::make($name);
    }

    /**
     * Create a radio field
     */
    public static function radio(string $name): RadioField
    {
        return RadioField::make($name);
    }

    /**
     * Create a checkbox field
     */
    public static function checkbox(string $name): CheckboxField
    {
        return CheckboxField::make($name);
    }

    /**
     * Create a toggle field
     */
    public static function toggle(string $name): ToggleField
    {
        return ToggleField::make($name);
    }

    /**
     * Create a hidden field
     */
    public static function hidden(string $name): HiddenField
    {
        return HiddenField::make($name);
    }

    /**
     * Create a slider field
     */
    public static function slider(string $name): SliderField
    {
        return SliderField::make($name);
    }

    /**
     * Create a file upload field
     */
    public static function file(string $name): FileField
    {
        return FileField::make($name);
    }

    /**
     * Create a checkbox list field
     */
    public static function checkboxList(string $name): CheckboxListField
    {
        return CheckboxListField::make($name);
    }

    /**
     * Create a rich text editor field
     */
    public static function richText(string $name): RichTextField
    {
        return RichTextField::make($name);
    }

    /**
     * Create a repeater field
     */
    public static function repeater(string $name): RepeaterField
    {
        return RepeaterField::make($name);
    }

    /**
     * Create a key-value field
     */
    public static function keyValue(string $name): KeyValueField
    {
        return KeyValueField::make($name);
    }

    /**
     * Create a tags field
     */
    public static function tags(string $name): TagsField
    {
        return TagsField::make($name);
    }

    /**
     * Create a custom field
     */
    public static function custom(string $name): CustomField
    {
        return CustomField::make($name);
    }

    /**
     * Legacy support for the old API
     *
     * @deprecated Use specific field type methods instead
     */
    public static function make(string $name): AbstractField
    {
        return TextField::make($name);
    }
}
