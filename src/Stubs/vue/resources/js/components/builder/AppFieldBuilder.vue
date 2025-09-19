<script setup lang="ts">
import { h } from 'vue'
import type { FieldDefinition } from '@/types/field-builder'

import AppFieldBuilderLabel from "@/components/builder/field/AppFieldBuilderLabel.vue"
import AppFieldBuilderText from "@/components/builder/field/AppFieldBuilderText.vue"
import { useFormStore } from '@/stores/form'
import AppFieldInfoTextList from './info/AppFieldInfoTextList.vue'
import AppFieldInfoMarkdown from './info/AppFieldInfoMarkdown.vue'
import AppFieldInfoDate from './info/AppFieldInfoDate.vue'
import AppFieldInfoFile from './info/AppFieldInfoFile.vue'
import AppFieldInfoText from './info/AppFieldInfoText.vue'
import AppFieldBuilderTextarea from './field/AppFieldBuilderTextarea.vue'
import AppFieldBuilderSlider from './field/AppFieldBuilderSlider.vue'
import AppFieldBuilderFile from './field/AppFieldBuilderFile.vue'
import AppFieldBuilderPassword from './field/AppFieldBuilderPassword.vue'
import AppFieldBuilderHidden from './field/AppFieldBuilderHidden.vue'
import AppFieldBuilderMarkdown from './field/AppFieldBuilderMarkdown.vue'
import AppFieldBuilderRichText from './field/AppFieldBuilderRichText.vue'
import AppFieldBuilderCheckboxList from './field/checkbox/AppFieldBuilderCheckboxList.vue'
import AppFieldBuilderCheckbox from './field/checkbox/AppFieldBuilderCheckbox.vue'
import AppFieldBuilderToggle from './field/AppFieldBuilderToggle.vue'
import AppFieldBuilderRadio from './field/AppFieldBuilderRadio.vue'
import AppFieldBuilderRepeater from './field/AppFieldBuilderRepeater.vue'
import AppFieldBuilderKeyValue from './field/AppFieldBuilderKeyValue.vue'
import AppFieldBuilderTags from './field/AppFieldBuilderTags.vue'
import AppFieldBuilderDate from './field/AppFieldBuilderDate.vue'
import AppFieldBuilderDatetime from './field/AppFieldBuilderDatetime.vue'
import AppFieldBuilderFlatpickr from './field/AppFieldBuilderFlatpickr.vue'
import AppFieldBuilderSelectSingleNotSearchable from './field/select/single/AppFieldBuilderSelectSingleNotSearchable.vue'
import AppFieldBuilderSelectMultipleSearchable from './field/select/multiple/AppFieldBuilderSelectMultipleSearchable.vue'
import AppFieldBuilderSelectSingleSearchable from './field/select/single/AppFieldBuilderSelectSingleSearchable.vue'
import AppFieldBuilderSelectMultipleNotSearchable from './field/select/multiple/AppFieldBuilderSelectMultipleNotSearchable.vue'
import AppFieldBuilderComboboxMultiple from './field/combobox/AppFieldBuilderComboboxMultiple.vue'
import AppFieldBuilderComboboxSingle from './field/combobox/AppFieldBuilderComboboxSingle.vue'
import AppFieldBuilderCustom from './field/AppFieldBuilderCustom.vue'

interface Props {
    field: FieldDefinition
    idx: string
}

const props = defineProps<Props>()
const store = useFormStore(props.idx)();
</script>

<template>
    <component v-if="!field.hidden" :is="() => {

        if (field.asInfo) {
            if (Array.isArray(store.getNestedValue(field.key))) {
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldInfoTextList, { value: store.getNestedValue(field.key, []) })
                })
            }

            switch (field.type) {
                case 'markdown':
                    return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                        default: () => h(AppFieldInfoMarkdown, { value: store.getNestedValue(field.key) })
                    })
                case 'datetime-local':
                case 'date':
                    return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                        default: () => h(AppFieldInfoDate, { value: store.getNestedValue(field.key) })
                    })
                case 'file':
                    return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                        default: () => h(AppFieldInfoFile, { value: store.getNestedValue(field.key) || field.preview })
                    })
                default:
                    return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                        default: () => h(AppFieldInfoText, { value: store.getNestedValue(field.key) })
                    })
            }
        }

        switch (field.type) {
            case 'textarea':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderTextarea, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: string | number | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'slider':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderSlider, {
                        field,
                        modelValue: store.getNestedValue(field.key, [0]),
                        'onUpdate:modelValue': (val: number[] | null | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'file':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderFile, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'text':
            case 'number':
            case 'email':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderText, {
                        field,
                        idx: props.idx,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: string | number | undefined) => {
                            store.onReactive(field.key, val);
                        },
                    }),
                })
            case 'password':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderPassword, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: string | number | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'hidden':
                return h(AppFieldBuilderHidden, {
                    field,
                    modelValue: store.getNestedValue(field.key),
                    idx: props.idx
                })
            case 'markdown':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderMarkdown, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: string | number | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'checkbox-list':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderCheckboxList, {
                        field,
                        modelValue: store.getNestedValue(field.key, []),
                        'onUpdate:modelValue': (val: Array<string | number> | null | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'rich-text':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderRichText, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: string | number | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'repeater':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderRepeater, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: any[] | undefined) => {
                            store.onReactive(field.key, val || []);
                        },
                        idx: props.idx
                    })
                })
            case 'key-value':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderKeyValue, {
                        field,
                        modelValue: store.getNestedValue(field.key, {}),
                        'onUpdate:modelValue': (val: Record<string, string> | null | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'tags':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderTags, {
                        field,
                        modelValue: store.getNestedValue(field.key, []),
                        'onUpdate:modelValue': (val: string[] | null | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'custom':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderCustom, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'flatpickr':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderFlatpickr, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'date':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderDate, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'datetime-local':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderDatetime, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'select':
                if (field.multiple && !field.searchable) return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderSelectMultipleNotSearchable, {
                        field,
                        modelValue: store.getNestedValue(field.key) || [],
                        idx: props.idx
                    })
                })
                if (!field.multiple && field.searchable) return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderSelectSingleSearchable, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
                if (field.multiple && field.searchable) return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderSelectMultipleSearchable, {
                        field,
                        modelValue: store.getNestedValue(field.key) || [],
                        idx: props.idx
                    })
                })
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderSelectSingleNotSearchable, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'combobox':
                if (field.multiple) return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderComboboxMultiple, {
                        field,
                        modelValue: store.getNestedValue(field.key) || [],
                        idx: props.idx
                    })
                })
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderComboboxSingle, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        idx: props.idx
                    })
                })
            case 'radio':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderRadio, {
                        field,
                        modelValue: store.getNestedValue(field.key),
                        'onUpdate:modelValue': (val: string | null | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'checkbox':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderCheckbox, {
                        field,
                        modelValue: store.getNestedValue(field.key, false),
                        'onUpdate:modelValue': (val: null | boolean | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            case 'toggle':
                return h(AppFieldBuilderLabel, { field, error: store.formErrors[props.field.key] }, {
                    default: () => h(AppFieldBuilderToggle, {
                        field,
                        modelValue: store.getNestedValue(field.key, false),
                        'onUpdate:modelValue': (val: null | boolean | undefined) => {
                            store.onReactive(field.key, val);
                        },
                        idx: props.idx
                    })
                })
            default:
                return null
        }
    }" />
</template>
