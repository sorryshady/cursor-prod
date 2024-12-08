import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TableData } from "@/components/admin/data-table/type";
import { queryClient } from "@/app/providers";
import { toast } from "sonner";

export interface FilterState {
  search: string;
  designation: string[];
  committee: string[];
  department: string[];
  status: "VERIFIED" | "PENDING";
  district: string[];
  // Add future filters here
  // department?: string[];
  // district?: string[];
}
interface APIResponse {
  users: TableData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useUserTable(initialStatus: "VERIFIED" | "PENDING") {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    designation: [],
    committee: [],
    department: [],
    status: initialStatus,
    district: [],
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [
    debouncedSearch,
    filters.designation,
    filters.committee,
    filters.department,
    filters.status,
    filters.district,
  ]);

  const fetchUsers = async () => {
    const { data } = await axios.post<APIResponse>("/api/admin/table", {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      designation: filters.designation,
      committeeType: filters.committee,
      department: filters.department,
      status: filters.status,
      district: filters.district,
    });

    return {
      ...data,
      pageCount: data.totalPages,
      pageIndex: data.page,
    };
  };

  const query = useQuery({
    queryKey: [
      "users",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearch,
      filters.designation,
      filters.committee,
      filters.department,
      filters.status,
      filters.district,
    ],
    queryFn: fetchUsers,
    placeholderData: (previousData) => previousData,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      email,
      status,
    }: {
      email: string;
      status: "VERIFIED" | "PENDING" | "REJECTED";
    }) => {
      const { data } = await axios.post("/api/admin/table/verification", {
        email,
        status,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch the users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Success", {
        description: "User status updated successfully",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to update user status",
      });
      console.error("Status update error:", error);
    },
  });

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return {
    ...query,
    pagination,
    setPagination,
    filters,
    updateFilter,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
}
