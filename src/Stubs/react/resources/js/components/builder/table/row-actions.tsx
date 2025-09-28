import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, RefreshCw, XCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import { DataItem } from "@/types/datatable";
import { route } from 'ziggy-js';

interface RowActionsProps {
    item: DataItem;
    baseRoute: string;
    show?: boolean;
    edit?: boolean;
    del?: boolean;
    restore?: boolean;
    forceDelete?: boolean;
}

export default function AppDatatableRowActions({
    item,
    baseRoute,
    show = true,
    edit = true,
    del = true,
    restore = true,
    forceDelete = true,
}: RowActionsProps) {
    const id = item.id as string | number;
    const isDeleted = Boolean(item.deleted_at);

    return (
        <div className="flex">
            {!isDeleted && (
                <>
                    {show && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => router.visit(route(`${baseRoute}.show`, id))}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}

                    {edit && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer text-primary"
                            onClick={() => router.visit(route(`${baseRoute}.edit`, id))}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}

                    {del && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive-foreground cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure want to delete this row {id}?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive-foreground cursor-pointer"
                                        onClick={() =>
                                            router.delete(route(`${baseRoute}.destroy`, id), {
                                                preserveScroll: true,
                                            })
                                        }
                                    >
                                        Proceed
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </>
            )}

            {isDeleted && (
                <>
                    {restore && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-primary hover:text-primary-foreground cursor-pointer"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Want to restore this row {id}?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-primary hover:bg-primary-foreground cursor-pointer"
                                        onClick={() =>
                                            router.put(route(`${baseRoute}.restore`, id), {
                                                preserveScroll: true,
                                            })
                                        }
                                    >
                                        Restore
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {forceDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive-foreground cursor-pointer"
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Final Deletion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This row {id} will be permanently deleted. Proceed?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive-foreground cursor-pointer"
                                        onClick={() =>
                                            router.delete(route(`${baseRoute}.forceDestroy`, id), {
                                                preserveScroll: true,
                                            })
                                        }
                                    >
                                        Force Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </>
            )}
        </div>
    );
}
