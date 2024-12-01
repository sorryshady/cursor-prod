import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Terms of Service"
        description={`Last updated: ${new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      />
      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
          <p>
            By accessing our service, you agree to these terms and our privacy
            and cookie policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information</li>
            <li>Maintain account security</li>
            <li>Comply with Indian laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Limitation of Liability
          </h2>
          <p>
            We strive to provide reliable services but are not liable for any
            damages arising from service use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
          <p>
            We may update these terms. Continued use after changes constitutes
            acceptance.
          </p>
        </section>
      </Card>
    </div>
  );
}
