<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { router } from "@inertiajs/vue3";
import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition & { serverside?: boolean };
    modelValue: string | string[];
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

const toggleValue = (optValue: string) => {
    const current = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : [];
    const newSet = new Set(current);
    if (newSet.has(optValue)) {
        newSet.delete(optValue);
    } else {
        newSet.add(optValue);
    }
    store.onReactive(props.field.key, Array.from(newSet));
};

const selectedLabel = () => {
    const count = Array.isArray(props.modelValue) ? props.modelValue.length : props.modelValue ? 1 : 0;
    return count > 0 ? `${count} selected` : props.field.placeholder || 'Select options';
};
</script>

<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" :disabled="field.isDisable"
                :class="cn('w-full justify-between text-muted-foreground hover:text-muted-foreground', field.mergeClass)">
                {{ selectedLabel() }}
            </Button>
        </PopoverTrigger>

        <PopoverContent class="min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
                <CommandInput v-model="searchQuery" placeholder="Search..." class="h-9" />
                <CommandEmpty v-if="field.options && field.options.length == 0">No option found.</CommandEmpty>
                <CommandGroup class="max-h-60 overflow-y-auto">
                    <CommandItem v-for="(opt) in field.options" :key="opt.id"
                        :value="String(opt.value)" @select="() => toggleValue(opt.value)">
                        <Checkbox
                            :modelValue="Array.isArray(modelValue) ? modelValue.includes(opt.value) : String(modelValue) === String(opt.value)"
                            class="mr-2" />
                        {{ opt.label }}
                    </CommandItem>
                </CommandGroup>
            </Command>
        </PopoverContent>
    </Popover>
</template>
