"use client";

import { useState } from "react";
import { DistrictMemberType } from "@/types/committee";
import { DistrictMembers } from "./district-members";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

interface DistrictSelectorProps {
  members: DistrictMemberType[];
}

export function DistrictSelector({ members }: DistrictSelectorProps) {
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictMemberType["workDistrict"]>("KASARAGOD");

  const districts = [
    { name: "KASARAGOD", displayName: "Kasaragod" },
    { name: "KANNUR", displayName: "Kannur" },
    { name: "WAYANAD", displayName: "Wayanad" },
    { name: "KOZHIKODE", displayName: "Kozhikode" },
    { name: "MALAPPURAM", displayName: "Malappuram" },
    { name: "PALAKKAD", displayName: "Palakkad" },
    { name: "THRISSUR", displayName: "Thrissur" },
    { name: "ERNAKULAM", displayName: "Ernakulam" },
    { name: "IDUKKI", displayName: "Idukki" },
    { name: "KOTTAYAM", displayName: "Kottayam" },
    { name: "ALAPPUZHA", displayName: "Alappuzha" },
    { name: "PATHANAMTHITTA", displayName: "Pathanamthitta" },
    { name: "KOLLAM", displayName: "Kollam" },
    { name: "THIRUVANANTHAPURAM", displayName: "Thiruvananthapuram" },
  ];

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg">
        {/* District Grid */}
        <CardHeader className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {districts.map((district) => (
              <Button
                variant={"link"}
                key={district.name}
                onClick={() => setSelectedDistrict(district.name as DistrictMemberType["workDistrict"])}
                className={`p-4 text-center text-white text-base rounded-md transition-all hover:no-underline w-fit hover:text-yellow-300 ${
                  selectedDistrict === district.name
                    ? "text-yellow-300 hover:text-yellow-200"
                    : ""
                }`}
              >
                {district.displayName}
              </Button>
            ))}
          </div>
        </CardHeader>

        {/* Members Display */}
        <CardContent className="bg-sky-100/50 p-8">
          {selectedDistrict && (
            <div className="mt-3">
              <h3 className="text-xl font-semibold text-black mb-6 text-center">
                {
                  districts.find((d) => d.name === selectedDistrict)
                    ?.displayName
                }{" "}
                District Members
              </h3>
              <DistrictMembers
                members={members.filter(
                  (member) => member.workDistrict === selectedDistrict,
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
