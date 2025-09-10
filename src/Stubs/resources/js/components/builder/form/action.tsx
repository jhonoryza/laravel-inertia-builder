import { Button } from "@/components/ui/button";
import { Form } from "@/types/form";
import { Link, router } from "@inertiajs/react";
import { RefreshCw } from "lucide-react";
import { route } from "ziggy-js";

type Props = {
    form: Form;
    processing: boolean;
}

export function AppFormBuilderAction({ form, processing }: Props) {
    const { mode, baseRoute, routeId, canEdit } = form;
    return (
        <div className="flex items-center justify-between">
            {mode === 'show' && (
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Button
                            onClick={() => {
                                router.visit(route(`${baseRoute}.edit`, routeId));
                            }}
                            variant="default"
                            type="button"
                            className="hover:cursor-pointer"
                        >
                            edit
                        </Button>
                    )}
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
            {(mode === 'edit' || mode === 'create') && (
                <div className="mb-2">
                    <Link
                        href={route(`${baseRoute}.edit`, routeId)}
                        className="flex items-center gap-2 text-sm hover:cursor-pointer hover:opacity-60"
                    >
                        <RefreshCw className="h-4 w-4 text-destructive" />
                        <span>reset</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
