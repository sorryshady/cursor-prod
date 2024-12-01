import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#20333C] flex items-center justify-center px-6">
      <div className="text-center space-y-8">
        {/* Animated 404 */}
        <h1 className="text-9xl font-bold text-white animate-bounce">404</h1>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            Oops! Page not found
          </h2>
          <p className="text-gray-300 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            asChild
            className="bg-[#FACE30] text-black hover:bg-[#FACE30]/90 w-full sm:w-auto"
            size="lg"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="default"
            className="border-white bg-white text-black hover:bg-white/70 w-full sm:w-auto"
            size="lg"
          >
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* AOEK Logo */}
        <div className="mt-12">
          <Link href="/" className="inline-block">
            <img
              src="/aoek-logo.webp"
              alt="AOEK Logo"
              className="h-16 w-auto mx-auto opacity-50 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
