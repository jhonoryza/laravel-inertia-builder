import {FieldDefinition} from "@/types/field-builder";
import {AppFormBuilder} from "@/components/builder/app-form-builder";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import {BreadcrumbItem} from "@/types";

type PageProps = {
    fields: FieldDefinition[];
    routeName: string;
};

export default function Create({fields, routeName}: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {title: `${routeName}`, href: route(routeName + ".index")},
        {title: 'new', href: route(routeName + ".create")},
        {title: '#', href: ''},
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`new ${routeName}`}/>
            <div className="p-4">
                <AppFormBuilder fields={fields} routeName={routeName} mode="create" />
            </div>
        </AppLayout>
    );
}

