<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { format } from 'date-fns';
import { useFormStore } from '@/stores/form';
import { CalendarDate, getLocalTimeZone, parseDate, Time, toCalendarDateTime, toZoned } from '@internationalized/date';

interface Props {
    field: FieldDefinition;
    modelValue: string | null;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

// Date part (CalendarDate)
const datePart = ref<CalendarDate | null>(props.modelValue ? parseDate(props.modelValue.substring(0, 10)) : null);

// Time part (string HH:mm:ss)
const getInitialTime = (): string => {
    if (props.modelValue) {
        return format(new Date(props.modelValue), 'HH:mm:ss');
    }
    return '00:00:00';
};
const timePart = ref<string>(getInitialTime());

// watch datePart and timePart
watch([datePart, timePart], ([newDate, newTime]) => {
    if (newDate && newTime) {
        if(props.field.utcConvert) {
            const [hours, minutes, seconds] = newTime.split(':').map(Number);
            const time = new Time(hours, minutes, seconds)
            const dateTime = toCalendarDateTime(newDate as CalendarDate, time)
            const zoned = toZoned(dateTime, getLocalTimeZone())
            store.onReactive(props.field.key, zoned.toDate().toISOString())
            return;
        }
        const isoLike = `${newDate.toString()}T${newTime}`
        store.onReactive(props.field.key, isoLike)
    }
});
</script>

<template>
    <div class="space-y-1">
        <div class="flex gap-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" :id="props.field.key" :class="cn(
                        'justify-start text-left font-normal',
                        !datePart && 'text-muted-foreground',
                        props.field.mergeClass
                    )">
                        {{ datePart ? datePart.toString() : props.field.placeholder || 'Select date' }}
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0 overflow-hidden" align="start">
                    <Calendar mode="single" v-model="datePart" captionLayout="dropdown" />
                </PopoverContent>
            </Popover>

            <Input type="time" step="1" v-model="timePart" :class="cn(
                'w-[140px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden',
                props.field.mergeClass
            )" />
        </div>
    </div>
</template>
