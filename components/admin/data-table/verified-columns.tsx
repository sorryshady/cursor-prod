import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, UserPen } from "lucide-react";
import Link from "next/link";
import { TableData } from "@/components/admin/data-table/type";
export const verifiedColumns: ColumnDef<TableData>[] = [
  {
    accessorKey: "membershipId",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => {
      const designation: string = row.getValue("designation");
      return (
        <div className="capitalize">
          {designation ? designation.toLowerCase().split("_").join(" ") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department: string = row.getValue("department");
      return <div className="">{department ? department : "-"}</div>;
    },
  },
  {
    accessorKey: "workDistrict",
    header: "Work District",
    cell: ({ row }) => {
      const workDistrict: string = row.getValue("workDistrict");
      return (
        <div className="capitalize">
          {workDistrict ? workDistrict.toLowerCase() : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "userRole",
    header: "Role",
    cell: ({ row }) => {
      const role: string = row.getValue("userRole");
      return (
        <div className="capitalize">{role ? role.toLowerCase() : "-"}</div>
      );
    },
  },
  {
    accessorKey: "committeeType",
    header: "Committee",
    cell: ({ row }) => {
      const committee: string = row.getValue("committeeType");
      return (
        <div className="capitalize">
          {committee ? committee.toLowerCase() : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/${email}?status=verified`}>
                <UserPen className="mr-2" /> View/Edit Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
