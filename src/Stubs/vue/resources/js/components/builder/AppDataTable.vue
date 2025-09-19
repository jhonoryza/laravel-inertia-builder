<script setup lang="ts">
import { DataItem, DataTableProps } from '@/types/datatable';
import { router, usePage } from '@inertiajs/vue3';
import { watch } from "vue";
import { route } from 'ziggy-js';
import AppDataTableContent from './table/AppDataTableContent.vue';
import AppDataTablePagination from './table/AppDataTablePagination.vue';
import AppDataTableToolbar from './table/AppDataTableToolbar.vue';
import AppDataTableActiveFilters from './table/AppDataTableActiveFilters.vue';
import { useFlashStore } from '@/stores/flash';
import { useDatatableStore } from '@/stores/datatable';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

type RespProp = {
    data: DataTableProps,
};

defineSlots<{
    rowAction?: { item: DataItem }
    toolbarAction?: () => any
}>();

const props = defineProps<{
    idx: string;
}>();

const store = useDatatableStore(props.idx)();

const name = store.tableData.name;
const prefix = store.tableData.prefix;
const disablePagination = store.tableData.disablePagination;

// --- watch flash
const flashStore = useFlashStore();
const page = usePage()

watch(
    () => page.props.flash,
    (flash) => {
        if (flash) {
            flashStore.setFlash(flash)
        }
    },
    { immediate: true }
)


// --- watch filters, sort, query ---
const { sort, dir, searchQuery, activeFilters } = storeToRefs(store);
const firstRender = ref(true);
watch([sort, dir, searchQuery, activeFilters], ([s, d, q, af], _, onCleanup) => {
    if (firstRender.value) {
        firstRender.value = false;
        return;
    }

    const handler = setTimeout(() => {
        const filterParams = af.reduce((acc, filter) => {
            if (filter.value && Array.isArray(filter.value) && filter.value.length > 0) {
                const joined = filter.value.length > 1 ? filter.value.join(",") : filter.value.toString();
                acc[`${prefix}filter[${filter.field}]`] = filter.operator ? `${filter.operator}:${joined}` : joined;
            } else if (filter.value) {
                acc[`${prefix}filter[${filter.field}]`] = filter.operator
                    ? `${filter.operator}:${filter.value}`
                    : (filter.value as string);
            }
            return acc;
        }, {} as Record<string, string>);

        const params = Object.keys(filterParams).length > 0 ? filterParams : {};

        const routeUrl = store.tableData.tableRoute
            ? store.tableData.tableRoute
            : route(`${store.tableData.baseRoute}.index`);

        const searchParam = prefix + "q";
        const sortByParam = prefix + "sort";
        const sortDirParam = prefix + "dir";

        router.get(
            routeUrl,
            {
                ...(params ? { ...params } : {}),
                [searchParam]: q,
                [sortByParam]: s,
                [sortDirParam]: d,
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: [name],
                onSuccess: (page) => {
                    const props = page.props as unknown as RespProp;
                    store.updateItems(props.data.items);
                }
            }
        );
    }, 350);

    onCleanup(() => clearTimeout(handler));
});

</script>

<template>
    <div class="overflow-auto rounded-xl border bg-background text-foreground shadow-sm">
        <AppDataTableToolbar :idx="idx">
            <template #toolbarAction>
                <slot name="toolbarAction" />
            </template>
        </AppDataTableToolbar>
        <AppDataTableActiveFilters :idx="idx" />
        <AppDataTableContent :idx="idx">
            <template #rowAction="{ item }">
                <slot name="rowAction" :item="item" />
            </template>
        </AppDataTableContent>

        <AppDataTablePagination v-if="!disablePagination" :idx="idx" />
    </div>
</template>
