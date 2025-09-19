import { AppFormBuilder } from "@/components/builder/app-form-builder";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { route } from "ziggy-js";
import { Form } from "@/types/form";
import { AppFormBuilderAction } from "@/components/builder/form/action";

type PageProps = {
    form: Form;
};

export default function Create({ form }: PageProps) {
    const { baseRoute, title } = form;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: title, href: route(baseRoute + ".index") },
        { title: 'new', href: route(baseRoute + ".create") },
        { title: '#', href: '' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`new ${title}`} />
            <div className="p-4">
                <Card className="p-4 max-w-full">
                    <CardContent>
                        <AppFormBuilder form={form} >
                            {{
                                formAction: (processing) => (
                                    <AppFormBuilderAction form={form} processing={processing} />
                                )
                            }}
                        </AppFormBuilder>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
