import Image from "next/image";
import { changeTypeToText } from "@/lib/utils";
import { Designation, District, User } from "@prisma/client";

interface ItemsProp {
  user: User;
  oldPosition?: Designation;
  newPosition?: Designation;
  oldWorkDistrict?: District;
  newWorkDistrict?: District;
  retirementDate?: Date;
  dateOfDeath?: Date;
  additionalNote?: string;
  designation?: Designation;
}
export function UpdateGrid({
  items,
  type,
}: {
  items: ItemsProp[];
  type: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-64">
        <p className="text-lg font-semibold text-white">No {type}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={`${item.user.id}-${type}-${item.user.name}-${Math.random()}`}
          className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
        >
          <div className="aspect-square relative">
            <Image
              src={item.user.photoUrl || "/fall-back.webp"}
              alt={item.user.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-bold text-white">{item.user.name}</h3>
            <p className="text-sm text-gray-200">{item.user.department}</p>

            {type === "transfers" && (
              <>
                <p className="text-sm text-gray-200 capitalize">
                  {changeTypeToText(item?.oldPosition || "")}
                </p>
                <p className="text-sm text-gray-200 capitalize">
                  {changeTypeToText(item?.oldWorkDistrict || "")} →{" "}
                  {changeTypeToText(item?.newWorkDistrict || "")}
                </p>
              </>
            )}

            {type === "promotions" && (
              <>
                <p className="text-sm text-gray-200 capitalize">
                  {changeTypeToText(item?.oldPosition || "")} →{" "}
                  {changeTypeToText(item?.newPosition || "")}
                </p>
              </>
            )}

            {type === "retirements" && (
              <>
                <p className="text-sm text-gray-200 capitalize">
                  {changeTypeToText(item?.oldPosition || "")}
                </p>
                <p className="text-sm text-gray-200">
                  Retired:{" "}
                  {new Date(item?.retirementDate || "").toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </>
            )}

            {type === "obituaries" && (
              <>
                <p className="text-sm text-gray-200 capitalize">
                  {changeTypeToText(item.user.designation || "")}
                </p>
                <p className="text-sm text-gray-200">
                  Died:{" "}
                  {new Date(item?.dateOfDeath || "").toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
