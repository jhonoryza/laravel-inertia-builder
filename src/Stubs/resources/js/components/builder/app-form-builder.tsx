/* eslint-disable @typescript-eslint/no-explicit-any */
import {Link, router, useForm, usePage} from '@inertiajs/react';
import {AppFieldBuilder} from "@/components/builder/app-field-builder";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {FieldDefinition} from "@/types/field-builder";
import {RefreshCw} from "lucide-react";

type PageProps = {
    fields: FieldDefinition[];
    routeName: string;
    routeId?: string;
    mode: string; // create, edit, show
};

export function AppFormBuilder({fields, routeName, routeId, mode}: PageProps) {
    const {flash} = usePage().props as { flash?: { success?: string, error?: string, description?: string } };
    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error, {
                position: "top-center",
            });
        }
        if (flash?.success) {
            toast.success(flash.success, {
                position: 'top-center',
                description: flash.description,
            });
        }
    }, [flash]);

    const initialFormValues = fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue ?? '';
        return acc;
    }, {} as Record<string, any>);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        transform
    } = useForm<Record<string, any>>(initialFormValues);

    // Inertia's 'patch' method does not support file uploads.
    // To handle file uploads in an update form, we must use 'post' and spoof the method by adding a '_method: "patch"' field to the data.
    // The 'transform' function is used here to add this field to the data right before it's submitted.
    transform((data) => (
        routeId
            ? { ...data, _method: 'patch' }
            : data
    ));

    // This is a neat trick to ensure that when the 'fields' prop updates from a partial reload,
    // the form state also gets updated with any new defaultValues from the server.
    useEffect(() => {
        const newInitialValues = fields.reduce((acc, field) => {
            acc[field.name] = field.defaultValue ?? data[field.name] ?? '';
            return acc;
        }, {} as Record<string, any>);
        setData(newInitialValues);
    }, [fields]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (routeId) {
            post(route(`${routeName}.update`, routeId));
            return;
        }
        post(route(`${routeName}.store`));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl border shadow-lg p-4 rounded-lg"
              encType="multipart/form-data">
            {mode === 'show' && (
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => {
                            router.visit(route(`${routeName}.edit`, routeId));
                        }}
                        variant="default"
                        type="button"
                        className="hover:cursor-pointer"
                    >
                        edit
                    </Button>
                    <Button
                        onClick={() => {
                            router.visit(route(`${routeName}.index`, routeId));
                        }}
                        variant="link"
                        type="button"
                        className="hover:cursor-pointer"
                    >
                        back
                    </Button>
                </div>
            )}

            {fields.map((field) => (
                <AppFieldBuilder
                    key={field.name}
                    field={field}
                    value={data[field.name]}
                    setData={setData}
                    error={errors[field.name]}
                    isProcessing={processing}
                />
            ))}
            <div className="flex items-center justify-between">
                {(mode === "edit" || mode === "create") && (
                    <div className="flex items-center gap-2">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="hover:cursor-pointer"
                        >
                            save
                        </Button>
                        <Button
                            onClick={() => {
                                router.visit(route(`${routeName}.show`, routeId));
                            }}
                            variant="destructive"
                            type="button"
                            className="hover:cursor-pointer"
                        >
                            cancel
                        </Button>
                    </div>
                )}
                {mode === "edit" && (<div className="mb-2">
                        <Link href={route(`${routeName}.edit`, routeId)}
                              className="flex items-center gap-2 text-sm hover:cursor-pointer hover:opacity-60"
                        >
                            <RefreshCw className="h-4 w-4 text-destructive"/>
                            <span>reset</span>
                        </Link>
                    </div>
                )}
            </div>
        </form>
    );
}
