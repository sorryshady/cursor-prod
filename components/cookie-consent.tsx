"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          We use cookies and collect IP addresses for security and
          functionality. By using our site, you agree to our{" "}
          <a href="/privacy-policy" className="underline">
            privacy policy
          </a>{" "}
          and{" "}
          <a href="/cookie-policy" className="underline">
            cookie policy
          </a>
          .
        </p>
        <Button onClick={acceptCookies} className="whitespace-nowrap">
          Accept & Continue
        </Button>
      </div>
    </div>
  );
}
