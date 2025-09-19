<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { gridClasses } from '@/lib/utils'
import type { FieldDefinition } from '@/types/field-builder'
import { computed } from 'vue'

interface Props {
    field: FieldDefinition
    modelValue?: Array<string | number> | null | undefined
    idx: string
}

const props = defineProps<Props>()
const model = defineModel<typeof props.modelValue>()

function isChecked(value: string | number) {
    return computed({
        get: () => model.value?.includes(value) ?? false,
        set: (checked: boolean) => {
            if (!model.value) model.value = []
            if (checked) {
                if (!model.value.includes(value)) {
                    model.value = [...model.value, value]
                }
            } else {
                model.value = model.value.filter(v => v !== value)
            }
        }
    })
}
</script>

<template>
    <div :class="`space-y-2 gap-2 ${gridClasses(props.field.gridCol)}`">
        <template v-if="props.field.options?.length">
            <div v-for="option in props.field.options" :key="props.field.key + option.value.toString()"
                class="flex items-center space-x-2">
                <Checkbox
                    :id="`${props.field.key}-${option.value}`"
                    v-model="isChecked(option.value.toString()).value"
                    :class="props.field.mergeClass"
                    :disabled="props.field.isDisable"
                />
                <Label :for="`${props.field.key}-${option.value}`" class="text-sm font-normal">
                    {{ option.label }}
                </Label>
            </div>
        </template>

        <div v-else class="text-sm text-muted-foreground italic">
            {{ props.field.placeholder || 'No options available' }}
        </div>
    </div>
</template>
