import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  CheckIcon,
  Eye,
  Filter as FilterIconComponent,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import { Action, ActiveFilter, Column, DataTableProps, Filter } from "@/types/datatable";
import { router } from "@inertiajs/react";

interface AppDataTableToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIds: (string | number)[];
  activeFilters: ActiveFilter[];
  filters: DataTableProps["filters"];
  handleAddFilter: (field: string, value?: string) => void;
  columns: Column[];
  toggleColumn: (colName: string) => void;
  hiddenColumns: Record<string, boolean>;
  routeName: string;
  actions: DataTableProps["actions"];
  children?: React.ReactNode;
}

export function AppDataTableToolbar({
  searchQuery,
  setSearchQuery,
  selectedIds,
  activeFilters,
  filters,
  handleAddFilter,
  columns,
  toggleColumn,
  hiddenColumns,
  routeName,
  actions,
  children,
}: AppDataTableToolbarProps) {
  const [confirmAction, setConfirmAction] = useState<null | {
    name: string;
    label: string;
    message: string;
  }>(null);

  const handleAction = (action: Action) => {
    if (action.rowSelected && selectedIds.length === 0) return;

    if (action.needConfirm) {
      setConfirmAction(action);
      return;
    }

    router.visit(route(`${routeName}.actions`), {
      method: "post",
      data: {
        ids: selectedIds,
        action: action.name,
      },
      preserveScroll: true,
    });
  };

  const confirmAndRunAction = () => {
    if (!confirmAction) return;
    router.visit(route(`${routeName}.actions`), {
      method: "post",
      data: {
        ids: selectedIds,
        action: confirmAction.name,
      },
      preserveScroll: true,
    });
    setConfirmAction(null);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="cursor-pointer flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <WrenchIcon />
                  Action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {actions.map((action) => (
                    <DropdownMenuItem
                      key={action.name}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAction(action);
                      }}
                      disabled={action.rowSelected && selectedIds.length === 0}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                  {children}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {(filters.opt?.length ?? 0) > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                >
                  <FilterIconComponent className="h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Available Filters</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {filters.opt?.map((filter: Filter) => (
                    <DropdownMenuItem
                      key={filter.field}
                      onSelect={() => handleAddFilter(filter.field)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {activeFilters.find((f) => f.field === filter.field) ? (
                        <CheckIcon />
                      ) : (
                        <XIcon />
                      )}
                      <span>{filter.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuGroup>
                {columns.map((col) => (
                  <DropdownMenuItem
                    key={col.name}
                    onSelect={() => toggleColumn(col.name)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {!hiddenColumns[col.name] ? <CheckIcon /> : <XIcon />}
                    <span>{col.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modal konfirmasi */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.message ??
                `Are you sure want to run this action ${confirmAction?.label}?`}
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedIds.join(", ")}
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAndRunAction}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
