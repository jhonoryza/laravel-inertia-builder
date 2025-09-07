import React from 'react';
import { Head } from '@inertiajs/react';
import AppDataTable from "@/components/builder/app-datatable";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { DataTableProps } from "@/types/datatable";
import AppDatatableRowActions from '@/components/builder/table/row-actions';
import { route } from 'ziggy-js';

interface Props {
    data: DataTableProps;
}

export default function Index({ data }: Props) {
    const { baseRoute, tableRoute, title } = data
    const routeUrl = tableRoute ? tableRoute : route(baseRoute + ".index")

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: routeUrl,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="p-4">
                <AppDataTable data={data}>
                    {{
                        rowAction: (item) => (
                            <AppDatatableRowActions
                                item={item}
                                baseRoute={data.baseRoute}
                                edit={data.edit}
                                show={data.view}
                                del={data.delete}
                            />
                        ),
                        toolbarAction: (
                            <>
                            </>
                        ),
                    }}
                </AppDataTable>
            </div>
        </AppLayout>
    );
}
