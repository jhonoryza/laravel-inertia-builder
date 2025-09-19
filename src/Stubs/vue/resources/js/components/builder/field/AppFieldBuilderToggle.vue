<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import type { FieldDefinition } from '@/types/field-builder'

interface Props {
    field: FieldDefinition
    modelValue?: null | boolean
    idx?: string
}

const props = defineProps<Props>()
const model = defineModel<typeof props.modelValue>()

</script>

<template>
    <div>
        <Switch :id="props.field.key" v-model="model"
            :class="props.field.mergeClass" :disabled="props.field.isDisable" />
    </div>
</template>
