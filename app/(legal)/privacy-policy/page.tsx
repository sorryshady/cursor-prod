import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      />
      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">
            Data Collection and Usage
          </h2>
          <p>We collect and process the following information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP addresses for security and rate limiting</li>
            <li>Authentication tokens for secure access</li>
            <li>User account information provided during registration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Storage</h2>
          <p>
            Your data is securely stored in India and retained only as long as
            necessary.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
          <p>Under Indian data protection laws, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p>For any privacy-related queries, contact us at: [Your Email]</p>
        </section>
      </Card>
    </div>
  );
}
