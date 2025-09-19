<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { useDatatableStore } from '@/stores/datatable';
import { customFilterComponents } from '@/components/builder/custom-filters';

// UI components
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import AppFilterDate from '@/components/builder/filter/AppFilterDate.vue';
import { DataTableProps } from '@/types/datatable';

const props = defineProps<{
    idx: string
    activeFilter: any
}>()

// store
const store = useDatatableStore(props.idx)();

// filterDef
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const filterDef = computed(() => store.tableData.filters.opt?.find(
    f => f.field === props.activeFilter.field
)!);

// local state
const localValue = ref(
    Array.isArray(props.activeFilter.value) ? [] : props.activeFilter.value
);

watch(
    () => props.activeFilter.value,
    val => {
        localValue.value = Array.isArray(val) ? [...val] : val ?? "";
    },
    { immediate: true }
);

// --------------------------------
// Helpers
// --------------------------------

// Toggle multi-select option
const toggleOption = (value: string, checked: boolean | string) => {
    const newSet = new Set(localValue.value);
    if (checked) newSet.add(value);
    else newSet.delete(value);

    localValue.value = Array.from(newSet);
    store.handleFilterChange(filterDef.value.field, localValue.value, props.activeFilter.operator ?? '=');
};

// Input / Text / Number
const handleInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    localValue.value = val;
    store.handleFilterChange(filterDef.value.field, val, props.activeFilter.operator ?? '=');
};

// Single select
const handleSelectChange = (val: any) => {
    localValue.value = val;
    store.handleFilterChange(filterDef.value.field, val, props.activeFilter.operator ?? '=');
};

// Search
const searchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

type RespProp = {
    data: DataTableProps,
};

const handleSearchInput = (val: string) => {
    searchQuery.value = val;
    
    if (!filterDef.value.serverside) return;
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        const key = `${filterDef.value.field}_q`;
        router.get(window.location.href, { [key]: val }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: [store.tableData.name],
            onSuccess: (page) => {
                const props = page.props as unknown as RespProp;
                const options = props.data.filters.opt?.find((f) => f.field === filterDef.value.field)?.options;
                if (options) {
                    store.updateFilterOptions(filterDef.value.field, options);
                }
            }
        });
    }, 500);
};

// Command select (single)
const handleCommandSelect = (val: any) => {
    handleSelectChange(val);
};

// Command multi-select
const handleCommandMultiSelect = (val: any) => {
    const current = Array.isArray(localValue.value)
        ? localValue.value
        : localValue.value
            ? [localValue.value]
            : [];

    const newSet = new Set(current);
    if (current.includes(val)) newSet.delete(val);
    else newSet.add(val);

    localValue.value = Array.from(newSet);
    store.handleFilterChange(filterDef.value.field, localValue.value, props.activeFilter.operator ?? '=');
};
</script>

<template>
    <!-- Date -->
    <template v-if="filterDef.type === 'date'">
        <AppFilterDate :idx="idx" :filter-def="filterDef" />
    </template>

    <!-- Boolean -->
    <template v-else-if="filterDef.type === 'boolean'">
        <RadioGroup @update:modelValue="val => handleSelectChange(val)">
            <div class="flex items-center space-x-2">
                <RadioGroupItem :id="`${filterDef.field}-true`" value="true" />
                <label :for="`${filterDef.field}-true`">Yes</label>
            </div>
            <div class="flex items-center space-x-2">
                <RadioGroupItem :id="`${filterDef.field}-false`" value="false" />
                <label :for="`${filterDef.field}-false`">No</label>
            </div>
        </RadioGroup>
    </template>

    <!-- Custom -->
    <template v-else-if="filterDef.type === 'custom'">
        <component v-if="filterDef.component && customFilterComponents[filterDef.component]"
            :is="customFilterComponents[filterDef.component]" :value="props.activeFilter.value" :filterDef="filterDef"
            :activeFilter="props.activeFilter" @change="(val: any) => handleSelectChange(val)" />
        <div v-else class="text-sm text-muted-foreground p-2">
            Unregistered custom filter component:
            <code>{{ filterDef.component ?? 'N/A' }}</code>
        </div>
    </template>

    <!-- Select -->
    <template v-else-if="filterDef.type === 'select'">
        <!-- Searchable Select -->
        <template v-if="filterDef.searchable">
            <!-- Multi select -->
            <Popover
                v-if="filterDef.multiple || props.activeFilter.operator === 'in' || props.activeFilter.operator === 'notIn'">
                <PopoverTrigger asChild>
                    <Button variant="outline" class="w-full justify-between bg-popover" role="combobox">
                        {{ Array.isArray(localValue) && localValue.length > 0
                            ? `${localValue.length} selected`
                            : `Select ${filterDef.label}...` }}
                        <span class="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0 max-h-64 overflow-y-auto">
                    <Command>
                        <CommandInput placeholder="Search..." class="h-9" @update:modelValue="handleSearchInput" />
                        <CommandEmpty v-if="filterDef.options && filterDef.options.length == 0">No option found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem v-for="opt in filterDef.options" :key="opt.id" :value="String(opt.value)" @select="() => handleCommandMultiSelect(opt.value)">
                                <Checkbox class="mr-2" :model-value="localValue.includes(opt.value)"
                                    @update:modelValue="checked => toggleOption(opt.value, checked)" />
                                {{ opt.label }}
                            </CommandItem>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            <!-- Single select -->
            <Popover v-else>
                <PopoverTrigger asChild>
                    <Button variant="outline" class="w-full justify-between bg-popover" role="combobox">
                        <span v-if="filterDef.options?.find(opt => opt.value === localValue)">
                            {{filterDef.options?.find(opt => opt.value === localValue)?.label}}
                        </span>
                        <span v-else class="text-muted-foreground">
                            Select {{ filterDef.label }}...
                        </span>
                        <span class="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0 max-h-64 overflow-y-auto">
                    <Command>
                        <CommandInput placeholder="Search..." class="h-9" @update:modelValue="handleSearchInput" />
                        <CommandEmpty v-if="filterDef.options && filterDef.options.length == 0">No option found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem v-for="(opt) in filterDef.options" 
                                :key="opt.id" 
                                :value="opt.value"
                                @select="() => handleCommandSelect(opt.value)">
                                <span class="mr-2 h-4 w-4"
                                    :style="{ opacity: String(opt.value) === String(localValue) ? 1 : 0 }">
                                    ✔
                                </span>
                                {{ opt.label }}
                            </CommandItem>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </template>

        <!-- Non-searchable Select -->
        <template v-else>
            <!-- Multi select -->
            <Popover
                v-if="filterDef.multiple || props.activeFilter.operator === 'in' || props.activeFilter.operator === 'notIn'">
                <PopoverTrigger asChild>
                    <Button variant="outline" class="w-full justify-between">
                        {{ localValue.length > 0
                            ? `${localValue.length} selected`
                            : `Select ${filterDef.label}...` }}
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-2 max-h-64 overflow-y-auto">
                    <label v-for="opt in filterDef.options" :key="opt.id"
                        class="flex items-center space-x-2 cursor-pointer">
                        <Checkbox :model-value="localValue.includes(opt.value)"
                            @update:modelValue="checked => toggleOption(opt.value, checked)" />
                        <span>{{ opt.label }}</span>
                    </label>
                </PopoverContent>
            </Popover>

            <!-- Single select -->
            <Select v-else v-model="localValue" @update:modelValue="handleSelectChange">
                <SelectTrigger>
                    <SelectValue :placeholder="`Select ${filterDef.label}...`" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="opt in filterDef.options" :key="opt.id" :value="opt.value">
                        {{ opt.label }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </template>
    </template>

    <!-- Text / Number -->
    <template v-else>
        <Input :type="filterDef.type === 'number' ? 'number' : 'text'" v-model="localValue" @input="handleInput"
            :placeholder="`Enter ${filterDef.label}...`" />
    </template>
</template>
