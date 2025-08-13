import React from 'react';
import {Head} from '@inertiajs/react';
import AppDataTable from "@/components/builder/app-datatable";
import AppLayout from "@/layouts/app-layout";
import {BreadcrumbItem} from "@/types";
import {DataTableProps} from "@/types/datatable";

interface Props {
    data: DataTableProps;
    routeName: string;
    tableRoute: string;
}

export default function Index({data, routeName, tableRoute}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: routeName,
            href: route(routeName + ".index"),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={routeName}/>
            <div className="p-4">
                <AppDataTable data={data}
                              routeName={routeName}
                              tableRoute={tableRoute}
                />
            </div>
        </AppLayout>
    );
}
