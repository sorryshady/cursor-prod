import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Association of Engineers Kerala",
  description:
    "The Association of Engineers Kerala is a non-profit politically neutral organization representing working as well as retired engineers from the Public Works, Irrigation and Local Self Government Departments of the Government of Kerala",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <CookieConsent />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
