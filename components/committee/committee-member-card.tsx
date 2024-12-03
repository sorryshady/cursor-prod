"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Phone, Mail, MapPin, Badge, Hash } from "lucide-react";
import {
  StatePositionTitle,
  DistrictPositionTitle,
  Department,
  Designation,
  BloodGroup,
} from "@prisma/client";
import { cn } from "@/lib/utils";

interface CommitteeMemberProps {
  member: {
    id: string;
    name: string;
    photoUrl: string | null;
    positionState?: StatePositionTitle | null;
    positionDistrict?: DistrictPositionTitle | null;
    designation: Designation | null;
    department: Department | null;
    bloodGroup: BloodGroup;
    mobileNumber: string;
    membershipId: number | null;
    personalAddress: string;
    email: string;
  };
  className?: string;
}

export function CommitteeMemberCard({
  member,
  className,
}: CommitteeMemberProps) {
  const position = member.positionState || member.positionDistrict;

  return (
    <Card className={cn("overflow-hidden bg-white w-[300px]", className)}>
      <div className="relative aspect-square w-full">
        <Image
          src={member.photoUrl || "/member-placeholder.webp"}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {member.name}
        </h3>
        {position && (
          <p className="text-[#35718E] font-medium mb-2 capitalize">
            {position.replace(/_/g, " ").toLowerCase()}
          </p>
        )}
        {member.designation && (
          <p className="text-gray-600 text-sm mb-4 capitalize">
            {member.designation.replace(/_/g, " ").toLowerCase()}
          </p>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 text-[#35718E] hover:text-[#35718E]/80 mx-auto">
              <Info className="h-4 w-4" />
              <span>View Details</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] md:max-w-[500px] rounded-md">
            <DialogHeader>
              <DialogTitle className="text-xl mb-4">{member.name}</DialogTitle>
            </DialogHeader>

            <div className="relative w-full aspect-square mb-6 overflow-hidden">
              <Image
                src={member.photoUrl || "/member-placeholder.webp"}
                alt={member.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <div className="space-y-4">
              {position && (
                <p className="text-[#35718E] font-medium capitalize">
                  {position.replace(/_/g, " ").toLowerCase()}
                </p>
              )}

              {member.designation && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">
                    {member.designation.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
              )}

              {member.membershipId && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>Membership ID: {member.membershipId}</span>
                </div>
              )}

              {member.mobileNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>Mobile: {member.mobileNumber}</span>
                </div>
              )}

              {member.personalAddress && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Address: {member.personalAddress}</span>
                </div>
              )}

              {member.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email: {member.email}</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
