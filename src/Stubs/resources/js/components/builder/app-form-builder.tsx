/* eslint-disable @typescript-eslint/no-explicit-any */
import {Link, router, useForm, usePage} from '@inertiajs/react';
import {AppFieldBuilder} from "@/components/builder/app-field-builder";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {ColumnDef, FieldDefinition} from "@/types/field-builder";
import {RefreshCw} from "lucide-react";
import {clsx} from "clsx";

type PageProps = {
    columns?: ColumnDef;
    fields: FieldDefinition[];
    routeName: string;
    routeId?: string;
    mode: string; // create, edit, show
    formClass: string;
};

export function AppFormBuilder({columns, fields: initialFields, routeName, routeId, mode, formClass}: PageProps) {
    const {flash} = usePage().props as { flash?: { success?: string, error?: string, description?: string } };
    
    // local state fields agar bisa diupdate saat reactive/live
    const [fields, setFields] = useState<FieldDefinition[]>(initialFields);

    useEffect(() => {
        if (flash?.error) {
            toast.error('error', {
                position: "top-center",
                description: flash.error,
            });
        }
        if (flash?.success) {
            toast.success('success', {
                position: 'top-center',
                description: flash.success,
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
            ? {...data, _method: 'patch'}
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

    const debounceTimeouts = React.useRef<Record<string, NodeJS.Timeout>>({});

    const onReactive = async (name: string, value: any, operator?: string) => {
        setData((prev: any) => ({ ...prev, [name]: value, operator }));
        const field = fields.find((f) => f.name === name);
        if (!field) return;
        if (!field.reactive || false) return;

        // jika ada debounce
        if (field.debounce && field.debounce > 0) {
            // clear timeout sebelumnya
            if (debounceTimeouts.current[name]) clearTimeout(debounceTimeouts.current[name]);

            // set timeout baru
            debounceTimeouts.current[name] = setTimeout(() => {
                sendLiveUpdate(name, value);
            }, field.debounce);
        } else {
            sendLiveUpdate(name, value);
        }
    }

    function getCookie(name: string): string {
        return (
            document.cookie
                .split('; ')
                .find((row) => row.startsWith(name + '='))
                ?.split('=')[1] || ''
        );
    }

    const sendLiveUpdate = async (name: string, value: any) => {
        try {
            const res = await fetch('/inertia-builder/reactive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name,
                    value,
                    state: { ...data, [name]: value },
                    formClass,
                }),
            });

            if (!res.ok) {
                console.error(`HTTP error! status: ${res.status}`);
                return;
            }

            const result = await res.json();
            if (result.fields) {
                const newState = result.fields.reduce((acc: any, field: any) => {
                    acc[field.name] = field.defaultValue ?? data[field.name] ?? '';
                    return acc;
                }, {} as Record<string, any>);

                setData(newState);
                setFields(result.fields);
            }
        } catch (error) {
            console.error('Live update failed:', error);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (routeId) {
            post(route(`${routeName}.update`, routeId));
            return;
        }
        post(route(`${routeName}.store`));
    };

    const gridClass = clsx(
        "grid gap-2",
        columns?.default && `grid-cols-${columns.default}`,
        columns?.sm && `sm:grid-cols-${columns.sm}`,
        columns?.md && `md:grid-cols-${columns.md}`,
        columns?.xl && `xl:grid-cols-${columns.xl}`,
        columns?.["2xl"] && `2xl:grid-cols-${columns["2xl"]}`
    );

    function fieldClasses(field: FieldDefinition) {
        const span = field.columnSpan || {} as ColumnDef;
        const order = field.columnOrder || {} as ColumnDef;

        return [
            span.default && `col-span-${span.default}`,
            span.sm && `sm:col-span-${span.sm}`,
            span.md && `md:col-span-${span.md}`,
            span.xl && `xl:col-span-${span.xl}`,
            span['2xl'] && `2xl:col-span-${span['2xl']}`,
            order.default && `order-${order.default}`,
            order.sm && `sm:order-${order.sm}`,
            order.md && `md:order-${order.md}`,
            order.xl && `xl:order-${order.xl}`,
            order['2xl'] && `2xl:order-${order['2xl']}`,
        ].filter(Boolean).join(" ");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
            <div className={gridClass}>
                {fields.map((field) => (
                    <div key={field.name} className={fieldClasses(field)}>
                        <AppFieldBuilder
                            key={field.name}
                            field={field}
                            value={data[field.name]}
                            onReactive={onReactive}
                            error={errors[field.name]}
                            isProcessing={processing}
                            setFields={setFields}
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between">
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
                                window.history.back();
                            }}
                            variant="link"
                            type="button"
                            className="hover:cursor-pointer"
                        >
                            back
                        </Button>
                    </div>
                )}
                {(mode === 'edit' || mode === 'create') && (
                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={processing} className="hover:cursor-pointer">
                            save
                        </Button>
                        <Button
                            onClick={() => {
                                window.history.back();
                            }}
                            variant="destructive"
                            type="button"
                            className="hover:cursor-pointer"
                        >
                            cancel
                        </Button>
                    </div>
                )}
                {mode === 'edit' && (
                    <div className="mb-2">
                        <Link
                            href={route(`${routeName}.edit`, routeId)}
                            className="flex items-center gap-2 text-sm hover:cursor-pointer hover:opacity-60"
                        >
                            <RefreshCw className="h-4 w-4 text-destructive" />
                            <span>reset</span>
                        </Link>
                    </div>
                )}
            </div>
        </form>
    );
}
