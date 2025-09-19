import type { Component } from "vue";
import ColorPickerField from "./ColorPickerField.vue";
import RatingField from "./RatingField.vue";

// Register all field custom component here.
// Key (ex: 'rating') is a key named will be used in backend PHP.


export const customFieldsComponents: Record<string, Component> = {
    'color-picker': ColorPickerField,
    'rating': RatingField,
};
