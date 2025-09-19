<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { DataTableProps } from "@/types/datatable";
import { route } from 'ziggy-js';
import AppDataTable from "@/components/builder/AppDataTable.vue";
import AppDataTableRowActions from "@/components/builder/table/AppDataTableRowActions.vue";
import { useDatatableStore } from '@/stores/datatable';

const props = defineProps<{
    data: DataTableProps;
}>();

// initialize table store
const idx = `${props.data.prefix}-${props.data.name}`;
const store = useDatatableStore(idx)();
store.setData(props.data);

const { baseRoute, tableRoute, title } = props.data;
const routeUrl = tableRoute ? tableRoute : route(baseRoute + ".index")

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: title,
        href: routeUrl,
    },
];

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">

        <Head :title="title" />
        <div className="p-4">
            <AppDataTable :idx="idx">
                <template #rowAction="{ item }">
                    <AppDataTableRowActions :item="item" :idx="idx" />
                </template>

                <template #toolbarAction>
                </template>
            </AppDataTable>
        </div>
    </AppLayout>
</template>
