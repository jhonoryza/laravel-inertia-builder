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

interface ImportDialogProps {
  routeName: string;
}

export default function ImportDialog({ routeName }: ImportDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    file: null as File | null,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.data.file) return;

    const data = new FormData();
    data.append("file", form.data.file);

    form.post(route(`${routeName}.import`), {
      data,
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
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Import
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
