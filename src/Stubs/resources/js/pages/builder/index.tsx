import React from 'react';
import {Head} from '@inertiajs/react';
import AppDataTable from "@/components/builder/app-datatable";
import AppLayout from "@/layouts/app-layout";
import {BreadcrumbItem} from "@/types";
import {DataTableProps} from "@/types/datatable";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Districts',
        href: '/districts',
    },
];

interface Props {
    data: DataTableProps;
    routeName: string;
}

export default function Index({data, routeName}: Props) {
    const { items, filters, columns, actions, perPage, perPageOptions } = data;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Districts"/>
            <div className="p-4">
                <AppDataTable items={items} columns={columns} filters={filters} routeName={routeName} actions={actions}
                    perPage={perPage} perPageOptions={perPageOptions} />
            </div>
        </AppLayout>
    );
}
