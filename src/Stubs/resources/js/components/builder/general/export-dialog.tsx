import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

interface ExportDialogProps {
  routeName: string;
}

export default function ExportDialog({ routeName }: ExportDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    from: "",
    to: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.get(route(`${routeName}.export`), {
      preserveScroll: true,
      onFinish: () => {
        form.reset();
        setOpen(false); // tutup dialog setelah submit
      },
    });
  };

  return (
    <>
      <DropdownMenuItem
        key="export"
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault(); // biar ga trigger auto-close
          setOpen(true);
        }}
      >
        Export
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
              <DialogDescription>
                Pilih rentang tanggal yang ingin diexport.
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
              />

              <label htmlFor="to" className="text-sm font-medium">
                To
              </label>
              <Input
                type="date"
                id="to"
                value={form.data.to}
                onChange={(e) => form.setData("to", e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Export
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
