import { Metadata } from "next";
import { getEvents } from "@/lib/sanity/queries";
import { EventCard } from "@/components/events/event-card";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Events | AOEK",
  description:
    "Discover upcoming and past events from the Association of Engineers Kerala.",
};

// Revalidate daily to check for new events
export const revalidate = 86400;

export default async function EventsPage() {
  const { upcomingEvents, ongoingEvents, pastEvents } = await getEvents();

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Events"
            description="Join us in our ongoing events, upcoming events or explore our past events"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          {/* Ongoing Events Section - Show only if there are ongoing events */}
          {ongoingEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-8">
                Ongoing Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ongoingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Events Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-200 py-8 bg-white/5 rounded-lg">
                <p>No upcoming events at the moment. Check back soon!</p>
              </div>
            )}
          </section>

          {/* Past Events Section - Show only if there are past events */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-white mb-8">
                Past Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}
        </Wrapper>
      </main>
    </div>
  );
}
