import {Head} from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import {BreadcrumbItem} from "@/types";
import {ColumnDef, FieldDefinition} from "@/types/field-builder";
import {AppFormBuilder} from "@/components/builder/app-form-builder";
import {Card, CardContent} from "@/components/ui/card";

type Form = {
    columns: ColumnDef;
    fields: FieldDefinition[];
};

type PageProps = {
    form: Form;
    routeName: string;
    routeId?: string;
    formClass: string;
};

export default function Edit({form, routeName, routeId, formClass}: PageProps) {
    const {columns, fields} = form;

    const breadcrumbs: BreadcrumbItem[] = [
        {title: `${routeName}`, href: route(routeName + ".index")},
        {title: 'edit', href: route(routeName + ".edit", routeId)},
        {title: `#${routeId}`, href: ''}
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`edit ${routeName} #${routeId}`}/>
            <div className="p-4">
                <Card className="p-4 max-w-full">
                    <CardContent>
                        <AppFormBuilder columns={columns} fields={fields} routeName={routeName} routeId={routeId}
                                        mode="edit" formClass={formClass} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
