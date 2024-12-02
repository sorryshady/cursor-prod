import { ColumnDef } from "@tanstack/react-table";
import { TableData } from "@/types/user-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Check, X, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface PendingColumnsProps {
  updateStatus: (params: {
    email: string;
    status: "VERIFIED" | "REJECTED";
  }) => void;
  isUpdating: boolean;
}
// export const pendingColumns: ColumnDef<TableData>[] = [
export const getPendingColumns = ({
  updateStatus,
  isUpdating,
}: PendingColumnsProps): ColumnDef<TableData>[] => [
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
    id: "actions",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isUpdating}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/${email}?status=pending`}>
                <User className="mr-2" /> See Profile
              </Link>
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Check className="mr-2" /> Approve User
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this user? This will grant
                    them access to the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => updateStatus({ email, status: "VERIFIED" })}
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <X className="mr-2" /> Reject User
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this user? They will not be
                    able to access the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => updateStatus({ email, status: "REJECTED" })}
                  >
                    Reject
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
