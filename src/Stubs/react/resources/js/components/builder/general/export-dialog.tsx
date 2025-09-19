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

interface ExportDialogProps {
    baseRoute: string;
}

export default function ExportDialog({ baseRoute }: ExportDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        from: "",
        to: "",
        action: "export"
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(route(`${baseRoute}.exports`), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                form.reset();
                setOpen(false); // close dialog after submit
            },
        });
    };

    return (
        <>
            <DropdownMenuItem
                key="export"
                className="cursor-pointer"
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                Export
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Export</DialogTitle>
                            <DialogDescription>
                                Choose a date range.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="from" className="text-sm font-medium">
                                From
                            </label>
                            <Input
                                type="date"
                                id="from"
                                value={form.data.from}
                                onChange={(e) => form.setData("from", e.target.value)}
                                required={true}
                            />

                            <label htmlFor="to" className="text-sm font-medium">
                                To
                            </label>
                            <Input
                                type="date"
                                id="to"
                                value={form.data.to}
                                onChange={(e) => form.setData("to", e.target.value)}
                                required={true}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer">
                                Export
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
