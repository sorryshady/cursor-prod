import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Cookie Policy"
        description={`Last updated: ${new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      />
      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Cookie Usage</h2>
          <p>We use cookies and similar technologies for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authentication and security</li>
            <li>User preferences</li>
            <li>
              Analytics (understanding how users interact with our service)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Types of Cookies</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Required for basic site
              functionality
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and
              choices
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. However,
            disabling certain cookies may limit site functionality.
          </p>
        </section>
      </Card>
    </div>
  );
}
