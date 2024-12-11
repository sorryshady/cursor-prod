import ContactForm from "@/components/contact/contact-form";
import EmbedMap from "@/components/contact/embed-map";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Wrapper } from "@/components/layout/wrapper";
import { MailOpen, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us | AOEK",
  description: "Get in touch with us for inquiries, collaborations, and more.",
};

export default function Contact() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Contact Us"
            description="Get in touch with us"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="flex gap-10 lg:gap-20 lg:flex-row flex-col items-start">
              <div className="w-full lg:w-1/2 text-white space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Let&apos;s talk</h1>
                  <p className="text-gray-200 text-lg">
                    We collaborate with thousands of creators, entrepreneurs and
                    complete legends.
                  </p>
                </div>

                <div className="space-y-6 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <MailOpen size={24} />
                    </div>

                    <div>
                      <p className="text-base text-gray-300">Our email</p>
                      <a
                        href="mailto:aoekerala@gmail.com"
                        className="text-yellow-300 hover:text-yellow-200"
                      >
                        aoekerala@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-base text-gray-300">Phone us</p>
                      <a
                        href="tel:+919544339218"
                        className="text-yellow-300 hover:text-yellow-200"
                      >
                        +91 9544339218
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-base text-gray-300">Find us</p>
                      <a
                        href="https://maps.app.goo.gl/DGo9YbajDhFFcUv19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-300 hover:text-yellow-200"
                      >
                        Open Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <ContactForm />
              </div>
            </div>

            <div className="mt-16">
              <EmbedMap />
            </div>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
