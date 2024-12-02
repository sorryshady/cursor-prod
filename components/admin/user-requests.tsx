import React, { useState, useEffect } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  PromotionTransferRequest,
  RequestType,
  User,
  VerificationStatus,
} from "@prisma/client";
import { changeTypeToText } from "@/lib/utils";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
// import SubmitButton from "./submit-button";
import { z } from "zod";

type RequestResponse = PromotionTransferRequest & {
  user: User;
};

const adminCommentsSchema = z.object({
  adminComments: z.string().optional(),
});

const UserRequests = () => {
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RequestResponse | null>(
    null,
  );
  const [requestAction, setRequestAction] = useState<VerificationStatus | null>(
    null,
  );

  const form = useForm<z.infer<typeof adminCommentsSchema>>({
    resolver: zodResolver(adminCommentsSchema),
    defaultValues: {
      adminComments: "",
    },
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/admin/requests");
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch requests");
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestAction = async (
    data: z.infer<typeof adminCommentsSchema>,
  ) => {
    if (!currentRequest) return;

    try {
      const response = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: currentRequest.id,
          status: requestAction,
          adminComments: data.adminComments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      // Remove the processed request from the list
      setRequests((prev) => prev.filter((req) => req.id !== currentRequest.id));

      toast.success(`Request ${changeTypeToText(requestAction!)} successfully`);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request");
    }
  };
  const openCommentDialog = (
    request: RequestResponse,
    action: VerificationStatus,
  ) => {
    setCurrentRequest(request);
    setRequestAction(action);
    setDialogOpen(true);
    form.reset(); // Reset form for new input
  };

  const renderDetails = (request: RequestResponse) => {
    switch (request.requestType) {
      case RequestType.TRANSFER:
        return (
          <div className="flex flex-col gap-2 mx-auto w-fit text-start">
            <div>
              Previous work district:{" "}
              {changeTypeToText(request.oldWorkDistrict!)}
            </div>
            <div>
              New work district: {changeTypeToText(request.newWorkDistrict!)}
            </div>
            <div>Previous office address: {request.oldOfficeAddress!}</div>
            <div>New office address: {request.newOfficeAddress!}</div>
          </div>
        );
      case RequestType.PROMOTION:
        return (
          <div className="flex flex-col gap-2 mx-auto w-fit text-start">
            <div>
              Previous designation: {changeTypeToText(request.oldPosition!)}
            </div>
            <div>New designation: {changeTypeToText(request.newPosition!)}</div>
          </div>
        );
      case RequestType.RETIREMENT:
        return (
          <div className="flex flex-col gap-2 mx-auto w-fit text-start">
            <div>Designation: {changeTypeToText(request.oldPosition!)}</div>
            <div>
              Work district: {changeTypeToText(request.oldWorkDistrict!)}
            </div>
            <div>Office address: {request.oldOfficeAddress!}</div>
            <div>
              Retirement Date:{" "}
              {new Date(request.retirementDate!).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        );
      default:
        return <div>Unknown Request Type</div>;
    }
  };

  return (
    <>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
              </div>
            </TableCell>
          </TableRow>
        ) : requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              <div className="flex justify-center items-center h-full text-muted-foreground">
                No requests found.
              </div>
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="text-center">
                {request.membershipId}
              </TableCell>
              <TableCell className="text-center">{request.user.name}</TableCell>
              <TableCell className="text-center">
                {changeTypeToText(request.requestType)}
              </TableCell>
              <TableCell className="text-center">
                {renderDetails(request)}
              </TableCell>
              <TableCell className="space-x-3 text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        onClick={() =>
                          openCommentDialog(
                            request,
                            VerificationStatus.VERIFIED,
                          )
                        }
                      >
                        <Check />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Approve Request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"destructive"}
                        onClick={() =>
                          openCommentDialog(
                            request,
                            VerificationStatus.REJECTED,
                          )
                        }
                      >
                        <X />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reject Request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {requestAction === "VERIFIED"
                ? "Approve Request"
                : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              Please provide comments for this request.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRequestAction)}>
              <FormField
                control={form.control}
                name="adminComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Comments</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          requestAction === "VERIFIED"
                            ? "Reason for approval"
                            : "Reason for rejection"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button
                  type="submit"
                  variant={requestAction === "VERIFIED" ? "default" : "destructive"}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {requestAction === "VERIFIED" ? "Approving..." : "Rejecting..."}
                    </>
                  ) : (
                    requestAction === "VERIFIED" ? "Approve" : "Reject"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRequests;
