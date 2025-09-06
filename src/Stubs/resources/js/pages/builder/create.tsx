import {ColumnDef, FieldDefinition} from "@/types/field-builder";
import {AppFormBuilder} from "@/components/builder/app-form-builder";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import {BreadcrumbItem} from "@/types";
import {Card, CardContent} from "@/components/ui/card";
import {route} from "ziggy-js";

type Form = {
    columns: ColumnDef;
    fields: FieldDefinition[];
};

type PageProps = {
    form: Form;
    routeName: string;
    formClass: string;
};

export default function Create({form, routeName, formClass}: PageProps) {
    const {columns, fields} = form;
    const breadcrumbs: BreadcrumbItem[] = [
        {title: `${routeName}`, href: route(routeName + ".index")},
        {title: 'new', href: route(routeName + ".create")},
        {title: '#', href: ''},
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`new ${routeName}`}/>
            <div className="p-4">
                <Card className="p-4 max-w-full">
                    <CardContent>
                        <AppFormBuilder columns={columns} fields={fields} routeName={routeName} mode="create" formClass={formClass} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

