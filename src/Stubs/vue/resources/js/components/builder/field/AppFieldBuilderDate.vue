<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useFormStore } from '@/stores/form';
import { FieldDefinition } from '@/types/field-builder';
import { CalendarDate, parseDate } from '@internationalized/date';
import { ref } from 'vue';
import { watch } from 'vue';

interface Props {
    field: FieldDefinition;
    modelValue: string | undefined;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();
const date = ref<CalendarDate | undefined>(
  props.modelValue ? parseDate(props.modelValue.split(" ")[0]) : undefined
)

watch(date, (val) => {
    store.onReactive(props.field.key, val ? val.toString() : undefined)
})
</script>

<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" :id="props.field.key" :disabled="props.field.isDisable" :class="cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                props.field.mergeClass
            )">
                {{ date ? date.toString() : 'select date' }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
            <Calendar mode="single" v-model="date" captionLayout="dropdown" />
        </PopoverContent>
    </Popover>
</template>
