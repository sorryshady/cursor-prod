"use client";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { committeeType, departmentType, userRole } from "./data/data";
import { FilterState } from "@/hooks/use-user-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  showRoleFilter?: boolean;
  showCommitteeFilter?: boolean;
}
export function DataTableToolbar<TData>({
  table,
  filters,
  onFilterChange,
  showRoleFilter = true,
  showCommitteeFilter = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    filters.role.length > 0 ||
    filters.committee.length > 0 ||
    filters.department.length > 0;
  // filters.search !== "";

  const handleReset = () => {
    onFilterChange("search", "");
    onFilterChange("role", []);
    onFilterChange("committee", []);
    onFilterChange("department", []);
    table.resetColumnFilters();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col flex-1 items-start space-y-2">
        <Input
          placeholder="Search using name or email..."
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex flex-1 flex-wrap gap-2">
          {showRoleFilter && table.getColumn("userRole") && (
            <DataTableFacetedFilter
              value={filters.role}
              onValueChange={(value) => onFilterChange("role", value)}
              title="Role"
              options={userRole}
            />
          )}
          {showCommitteeFilter && table.getColumn("committeeType") && (
            <DataTableFacetedFilter
              value={filters.committee}
              onValueChange={(value) => onFilterChange("committee", value)}
              title="Committee"
              options={committeeType}
            />
          )}
          <DataTableFacetedFilter
            value={filters.department}
            onValueChange={(value) => onFilterChange("department", value)}
            title="Department"
            options={departmentType}
          />

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
