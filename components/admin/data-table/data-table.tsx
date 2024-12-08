"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserTable } from "@/hooks/use-user-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { verifiedColumns } from "./verified-columns";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Loader2 } from "lucide-react";
import { TableData } from "@/components/admin/data-table/type";
import { getPendingColumns } from "./pending-columns";

const DataTable = ({ tab }: { tab: "general" | "pending" }) => {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    filters,
    updateFilter,
    updateStatus,
    isUpdating,
  } = useUserTable(tab === "general" ? "VERIFIED" : "PENDING");
  const columns =
    tab === "general"
      ? verifiedColumns
      : getPendingColumns({ updateStatus, isUpdating });

  const table = useReactTable({
    data: (data?.users as TableData[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filters={filters}
        onFilterChange={updateFilter}
        showDesignationFilter={tab === "general"}
        showCommitteeFilter={tab === "general"}
      />
      <div className="rounded-md border">
        {!isLoading ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="h-24 w-full flex justify-center items-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-base">Loading...</span>
          </div>
        )}
      </div>
      <DataTablePagination
        table={table}
        pageCount={data?.totalPages || 1}
        totalRecords={data?.total || 0}
      />
    </div>
  );
};

export default DataTable;
