import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";

interface ImportDialogProps {
    baseRoute: string;
}

export default function ImportDialog({ baseRoute }: ImportDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        file: null as File | null,
        action: "export"
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(route(`${baseRoute}.imports`), {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    return (
        <>
            <DropdownMenuItem
                key="import"
                className="cursor-pointer"
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                Import
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Import Data</DialogTitle>
                            <DialogDescription>
                                Pilih file untuk diimport (format .xlsx atau .csv).
                            </DialogDescription>
                        </DialogHeader>

                        <div>
                            <Input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={(e) =>
                                    form.setData("file", e.target.files?.[0] || null)
                                }
                            />
                            {form.errors.file && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.file}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 hover:cursor-pointer">
                                Import
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
