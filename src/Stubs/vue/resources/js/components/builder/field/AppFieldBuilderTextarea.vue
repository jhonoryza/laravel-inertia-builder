<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import type { FieldDefinition } from '@/types/field-builder'

interface Props {
    field: FieldDefinition
    modelValue?: string | number
    idx?: string
}

const props = defineProps<Props>()
const model = defineModel<typeof props.modelValue>();

</script>

<template>
    <Textarea :id="props.field.key" v-model="model" :cols="props.field.cols"
        :rows="props.field.rows" :placeholder="props.field.placeholder || 'Fill in here..'"
        :class="props.field.mergeClass" :disabled="props.field.isDisable" />
</template>
