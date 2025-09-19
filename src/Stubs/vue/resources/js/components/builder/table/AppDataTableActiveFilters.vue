<script lang="ts" setup>
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { XIcon, X } from 'lucide-vue-next';
import AppDataTableFilterOperator from './AppDataTableFilterOperator.vue';
import AppDataTableFilterInput from './AppDataTableFilterInput.vue';
import { useDatatableStore } from '@/stores/datatable';

interface Props {
    idx: string;
}

const props = defineProps<Props>();

const store = useDatatableStore(props.idx)();

</script>

<template>
    <div :class="cn('px-2 flex flex-wrap items-center gap-2', store.activeFilters.length > 0 ? 'mb-2' : '')">
        <template v-for="filter in store.activeFilters" :key="filter.field">
            <Popover :open="!!store.openFilterPopovers[filter.field]"
                @update:open="val => val ? store.openPopover(filter.field) : store.closePopover(filter.field)">
                <div class="flex items-center relative group">
                    <PopoverTrigger asChild>
                        <button class="inline-flex items-center cursor-pointer justify-center rounded border px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 gap-2
                     focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
                     hover:bg-accent hover:text-accent-foreground">
                            <span class="text-muted-foreground">{{store.tableData.filters.opt?.find(f => f.field ===
                                filter.field)?.label}}</span>
                            <span class="text-muted-foreground">{{ filter.operator ?? '' }}</span>
                            <span class="font-semibold">{{store.getDisplayFilter(filter,
                                store.tableData.filters.opt?.find(f => f.field
                                    === filter.field)!)}}</span>
                        </button>
                    </PopoverTrigger>
                    <button @click="store.removeFilter(filter.field)"
                        class="absolute -right-2 -top-2 z-10 h-4 w-4 items-center justify-center rounded-full border bg-background text-foreground/60 hover:cursor-pointer hover:opacity-60 hidden group-hover:inline-flex">
                        <XIcon class="h-3 w-3" />
                    </button>
                </div>

                <PopoverContent class="w-full p-2" align="start" @interact-outside.prevent>
                    <div class="flex flex-col gap-2 w-full">
                        <AppDataTableFilterOperator :idx="idx" :activeFilter="filter" />
                        <AppDataTableFilterInput :idx="idx" :activeFilter="filter" />
                    </div>
                    <div class="flex justify-end w-full pt-2 absolute -top-4 right-0">
                        <X class="w-5 h-5 cursor-pointer border-2 rounded-lg bg-muted text-foreground hover:opacity-60"
                            @click="store.closePopover(filter.field)" />
                    </div>
                </PopoverContent>
            </Popover>
        </template>
    </div>
</template>
