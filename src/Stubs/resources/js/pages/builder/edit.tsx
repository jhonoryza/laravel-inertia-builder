import {Head} from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import {BreadcrumbItem} from "@/types";
import {FieldDefinition} from "@/types/field-builder";
import {AppFormBuilder} from "@/components/builder/app-form-builder";

type PageProps = {
    fields: FieldDefinition[];
    routeName: string;
    routeId?: string;
};

export default function Edit({fields, routeName, routeId}: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {title: `${routeName}`, href: route(routeName + ".index")},
        {title: 'edit', href: route(routeName + ".edit", routeId)},
        {title: `#${routeId}`, href: ''}
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`edit ${routeName} #${routeId}`}/>
            <div className="p-4">
                <AppFormBuilder fields={fields} routeName={routeName} routeId={routeId} mode="edit" />
            </div>
        </AppLayout>
    );
}
