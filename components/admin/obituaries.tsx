"use client";

import { Obituary, User } from "@prisma/client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { changeTypeToText } from "@/lib/utils";
import Image from "next/image";

type ObituarieResponse = Obituary & {
  user: User;
};

const fetchObituaries = async (): Promise<ObituarieResponse[]> => {
  const response = await fetch("/api/admin/obituaries?includeExpired=true");

  if (!response.ok) {
    toast.error("Failed to fetch obituaries");
    throw new Error("Failed to fetch obituaries");
  }

  return response.json();
};

const Obituaries = () => {
  const {
    data: obituaries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "obituaries"],
    queryFn: fetchObituaries,
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

  if (isError || !Array.isArray(obituaries) || obituaries.length === 0) {
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
    <TableBody>
      {obituaries.map((obituary, index) => (
        <TableRow key={obituary.id}>
          <TableCell className="text-center">{index + 1}</TableCell>
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
  );
};

export default Obituaries;
