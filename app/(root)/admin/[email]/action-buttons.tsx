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
import axios from "axios";
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ActionButtons = ({ email }: { email: string }) => {
  const router = useRouter();
  const handleAction = async (action: string) => {
    try {
      if (action === "approve") {
        await axios.post("/api/admin/table/verification", {
          email,
          status: "VERIFIED",
        });
        toast.success("User request approved!");
      } else if (action === "reject") {
        await axios.post("/api/admin/table/verification", {
          email,
          status: "REJECTED",
        });
        toast.success("User request rejected!");
      }
      router.back();
    } catch (error) {
      toast.error("Error updating status");
      console.error("Error updating status:", error);
    }
  };
  return (
    <div className="flex gap-3 mt-5">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"outline"} className="flex-1">
            <CircleCheck className="h-5 w-5" /> Approve User
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this user? This will grant them
              access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild></AlertDialogAction>
            <AlertDialogAction asChild>
              <Button onClick={() => handleAction("approve")}>Approve</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"} className="flex-1">
            <CircleX /> Reject User
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this user? They will not be able
              to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => handleAction("reject")}
              >
                Reject
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionButtons;
