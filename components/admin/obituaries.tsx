"use client";

import { Obituary, User } from "@prisma/client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TableBody, TableCell, TableFooter, TableRow } from "../ui/table";
import { changeTypeToText } from "@/lib/utils";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ObituarieResponse = Obituary & {
  user: User;
};

interface PaginatedResponse {
  obituaries: ObituarieResponse[];
  totalPages: number;
  currentPage: number;
}

const ITEMS_PER_PAGE = 10;

const fetchObituaries = async (page: number): Promise<PaginatedResponse> => {
  const response = await fetch(
    `/api/admin/obituaries?includeExpired=true&page=${page}&limit=${ITEMS_PER_PAGE}`,
  );

  if (!response.ok) {
    toast.error("Failed to fetch obituaries");
    throw new Error("Failed to fetch obituaries");
  }

  return response.json();
};

const Obituaries = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "obituaries", currentPage],
    queryFn: () => fetchObituaries(currentPage),
  });

  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading...
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (isError || !data?.obituaries || data.obituaries.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <div className="flex justify-center items-center h-full text-muted-foreground">
              {isError ? "Error fetching obituaries" : "No obituaries found"}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {data.obituaries.map((obituary, index) => (
          <TableRow key={obituary.id}>
            <TableCell className="text-center">
              {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
            </TableCell>
            <TableCell className="text-center">{obituary.user.name}</TableCell>
            <TableCell className="text-center">
              {changeTypeToText(obituary.user.department || "-")}
            </TableCell>
            <TableCell className="text-center">
              {new Date(obituary.dateOfDeath).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </TableCell>
            <TableCell className="text-center">
              <div className="h-24 overflow-hidden">
                <Image
                  src={obituary.user.photoUrl || "/fall-back.webp"}
                  alt={obituary.user.name}
                  height={100}
                  width={100}
                  className="mx-auto object-cover"
                />
              </div>
            </TableCell>
            <TableCell className="text-center">
              {obituary.additionalNote}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {data.totalPages > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <div className="py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {[...Array(data.totalPages)].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(data.totalPages, p + 1),
                          )
                        }
                        className={
                          currentPage === data.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </>
  );
};

export default Obituaries;
