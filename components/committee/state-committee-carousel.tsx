import { getStateCommitteeMembers } from "@/lib/db/queries";
import { CommitteeCarousel } from "./committee-carousel";

export async function StateCommitteeCarousel() {
  const committee = await getStateCommitteeMembers(true);

  return <CommitteeCarousel members={committee} />;
}
