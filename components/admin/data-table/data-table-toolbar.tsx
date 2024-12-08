"use client";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  committeeType,
  departmentType,
  designationType,
  districtType,
} from "./data/data";
import { FilterState } from "@/hooks/use-user-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  showDesignationFilter?: boolean;
  showCommitteeFilter?: boolean;
}
export function DataTableToolbar<TData>({
  table,
  filters,
  onFilterChange,
  showCommitteeFilter = true,
  showDesignationFilter = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    filters.committee.length > 0 ||
    filters.department.length > 0 ||
    filters.designation.length > 0 ||
    filters.district.length > 0;

  const handleReset = () => {
    onFilterChange("search", "");
    onFilterChange("designation", []);
    onFilterChange("committee", []);
    onFilterChange("department", []);
    onFilterChange("district", []);
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
          {showDesignationFilter && table.getColumn("designation") && (
            <DataTableFacetedFilter
              value={filters.designation}
              onValueChange={(value) => onFilterChange("designation", value)}
              title="Designation"
              options={designationType}
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
          <DataTableFacetedFilter
            value={filters.district}
            onValueChange={(value) => onFilterChange("district", value)}
            title="District"
            options={districtType}
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
