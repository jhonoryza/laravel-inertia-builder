"use client";

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

interface RowActionsProps {
  item: DataItem;
  routeName: string;
  show?: boolean;
  edit?: boolean;
  del?: boolean;
  restore?: boolean;
  forceDelete?: boolean;
}

export default function AppDatatableRowActions({
  item,
  routeName,
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
              onClick={() => router.visit(route(`${routeName}.show`, id))}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {edit && (
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={() => router.visit(route(`${routeName}.edit`, id))}
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
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Want to delete this row {id}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    onClick={() =>
                      router.delete(route(`${routeName}.destroy`, id), {
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
                  className="text-green-500 hover:text-green-600 cursor-pointer"
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-500 hover:bg-green-600 cursor-pointer"
                    onClick={() =>
                      router.put(route(`${routeName}.restore`, id), {
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
                  className="text-red-500 hover:text-red-600 cursor-pointer"
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-700 hover:bg-red-800 cursor-pointer"
                    onClick={() =>
                      router.delete(route(`${routeName}.forceDestroy`, id), {
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
