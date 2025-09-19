<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import type { FieldDefinition } from '@/types/field-builder'

interface Props {
    field: FieldDefinition
    modelValue?: null | boolean | undefined
    idx?: string
}

const props = defineProps<Props>()
const model = defineModel<typeof props.modelValue>()

</script>

<template>
    <div>
        <Checkbox :id="props.field.key" v-model="model"
            :class="props.field.mergeClass" :disabled="props.field.isDisable" />
    </div>
</template>
