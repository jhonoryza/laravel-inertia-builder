<script lang="ts" setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition & { serverside?: boolean };
    modelValue: string | number;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

const searchQuery = ref('');
let timeoutRef: number | undefined;

watch(searchQuery, (val) => {
    if (!props.field.serverside) return;

    if (timeoutRef) clearTimeout(timeoutRef);

    timeoutRef = window.setTimeout(() => {
        const key = `${props.field.key}_q`;
        router.get(window.location.href, { [key]: val }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: (page: any) => {
                const fields = page.props?.form?.fields as FieldDefinition[];
                const field = fields.find((f) => f.key == props.field.key);
                if (fields && field) store.setFieldOption(props.field.key, field.options);
            }
        });
    }, 300);
});
</script>

<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" :disabled="field.isDisable"
                :class="cn('w-full justify-between', field.mergeClass)">
                <span v-if="field.options?.find(opt => opt.value === modelValue)?.label">
                    {{field.options.find(opt => opt.value === modelValue)?.label}}
                </span>
                <span v-else class="text-muted-foreground">
                    {{ field.placeholder || 'Select an option' }}
                </span>
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>

        <PopoverContent class="min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
                <CommandInput placeholder="Search..." class="h-9" v-model="searchQuery" />
                <CommandEmpty v-if="field.options && field.options.length == 0">No options found.</CommandEmpty>
                <CommandGroup class="max-h-60 overflow-y-auto">
                    <CommandItem v-for="(opt) in field.options"
                        :key="opt.id" :value="opt.label.toString()"
                        @select="store.onReactive(field.key, opt.value)">
                        <Check :class="cn('mr-2 h-4 w-4', opt.value === modelValue ? 'opacity-100' : 'opacity-0')" />
                        {{ opt.label }}
                    </CommandItem>
                </CommandGroup>
            </Command>
        </PopoverContent>
    </Popover>
</template>
