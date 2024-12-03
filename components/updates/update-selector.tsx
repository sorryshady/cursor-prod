"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { UpdateGrid } from "./update-grid";
import {
  Transfers,
  Promotions,
  Retirements,
  Obituaries,
} from "@/app/(root)/updates/page";

type UpdateSelectorProps = {
  transfers: Transfers[];
  promotions: Promotions[];
  retirements: Retirements[];
  obituaries: Obituaries[];
};

export function UpdateSelector({
  transfers,
  promotions,
  retirements,
  obituaries,
}: UpdateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("transfers");

  const getItems = (category: string) => {
    switch (category) {
      case "transfers":
        return transfers;
      case "promotions":
        return promotions;
      case "retirements":
        return retirements;
      case "obituaries":
        return obituaries;
      default:
        return transfers;
    }
  };

  return (
    <>
      {/* Mobile Select */}
      <div className="md:hidden mb-8">
        <Select defaultValue="transfers" onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full bg-white/10 text-white border-none">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transfers">Transfers</SelectItem>
            <SelectItem value="promotions">Promotions</SelectItem>
            <SelectItem value="retirements">Retirements</SelectItem>
            <SelectItem value="obituaries">Obituaries</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-6">
          <UpdateGrid
            items={getItems(selectedCategory)}
            type={selectedCategory}
          />
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs defaultValue="transfers">
          <TabsList className="grid grid-cols-4 w-full bg-white/10 p-1 rounded-lg">
            {["transfers", "promotions", "retirements", "obituaries"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-white capitalize data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  {tab}
                </TabsTrigger>
              ),
            )}
          </TabsList>

          {["transfers", "promotions", "retirements", "obituaries"].map(
            (category) => (
              <TabsContent key={category} value={category}>
                <UpdateGrid items={getItems(category)} type={category} />
              </TabsContent>
            ),
          )}
        </Tabs>
      </div>
    </>
  );
}
