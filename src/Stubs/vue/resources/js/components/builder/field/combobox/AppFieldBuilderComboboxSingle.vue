<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { router } from "@inertiajs/vue3";
import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition & { serverside?: boolean };
    modelValue: string;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

const searchQuery = ref('');
let timeoutRef: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (val) => {
    if (!props.field.serverside) return;

    if (timeoutRef) clearTimeout(timeoutRef);

    timeoutRef = setTimeout(() => {
        const key = `${props.field.key}_q`;
        router.get(
            window.location.href,
            { [key]: val },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: (page: any) => {
                    const fields = page.props?.form?.fields as FieldDefinition[];
                    const field = fields.find((f) => f.key == props.field.key);
                    if (fields && field) store.setFieldOption(props.field.key, field.options);
                },
            }
        );
    }, 300);
});

const selectedLabel = () => {
    return props.field.options?.find(opt => opt.value === props.modelValue)?.label || props.field.placeholder || 'Select an option';
};
</script>

<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" :aria-expanded="false" :disabled="field.isDisable"
                :class="cn('w-full justify-between', field.mergeClass)">
                <span :class="!modelValue ? 'text-muted-foreground' : ''">{{ selectedLabel() }}</span>
                <svg class="ml-2 h-4 w-4 shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </Button>
        </PopoverTrigger>

        <PopoverContent class="min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
                <CommandInput v-model="searchQuery" placeholder="Search..." class="h-9" />
                <CommandEmpty v-if="field.options && field.options.length == 0">No options found.</CommandEmpty>
                <CommandGroup class="max-h-60 overflow-y-auto">
                    <CommandItem v-for="(opt) in field.options" :key="opt.id"
                        :value="String(opt.value)" @select="() => store.onReactive(field.key, opt.value)">
                        <span
                            :class="cn('mr-2 h-4 w-4', opt.value === modelValue ? 'opacity-100' : 'opacity-0')">✔</span>
                        {{ opt.label }}
                    </CommandItem>
                </CommandGroup>
            </Command>
        </PopoverContent>
    </Popover>
</template>
