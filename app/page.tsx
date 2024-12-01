import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageBackground } from "@/components/layout/page-background";
import { Wrapper } from "@/components/layout/wrapper";

export default function HomePage() {
  return (
    <main className="w-full relative">
      {/* Full page background */}
      <PageBackground imageType="hero" withGradient />
      <section className=" min-h-screen">
        {/* Hero Content */}
        <Wrapper className="relative z-10 pt-20 md:pt-28 lg:pt-32 space-y-16 md:space-y-24 lg:space-y-32">
          <div className="flex flex-col gap-8 lg:flex-row justify-between items-center md:px-6 lg:px-10">
            {/* Left Content */}
            <div className="flex flex-col items-center lg:items-start gap-5 flex-1">
              <div className="space-y-2 text-center lg:text-left">
                {["Welcome to the", "Association Of", "Engineers Kerala"].map(
                  (text, i) => (
                    <h1
                      key={i}
                      className="uppercase text-3xl md:text-4xl xl:text-5xl text-white font-extrabold whitespace-nowrap"
                    >
                      {text}
                    </h1>
                  ),
                )}
              </div>

              <p className="text-white text-base md:text-lg max-w-2xl text-center lg:text-left">
                The Association of Engineers Kerala is a non-profit politically
                neutral organization representing working as well as retired
                engineers from the Public Works, Irrigation and Local Self
                Government Departments of the Government of Kerala
              </p>

              <div className="flex gap-4 md:gap-5">
                <Button
                  asChild
                  variant="destructive"
                  className="text-base md:text-lg font-bold py-4 md:py-5 px-6 md:px-8 rounded-xl shadow-xl"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="text-base md:text-lg font-bold py-4 md:py-5 px-6 md:px-8 rounded-xl shadow-xl bg-[#35718E] hover:bg-[#5386A4]"
                >
                  <Link href="/about">About Us</Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Logo */}
            <div className="flex-1 w-full max-w-[400px] lg:max-w-none">
              <Image
                src="/aoek-logo.webp"
                width={400}
                height={400}
                alt="AOEK Logo"
                priority
                className="object-contain w-[80%] mx-auto"
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 400px"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="hidden md:flex gap-10 text-white border-l-2 border-r-2 border-white/80 px-8 md:px-10 py-5 w-fit mx-auto">
            {[
              { value: "3", label: "Departments" },
              { value: "4000+", label: "Members" },
              { value: "60+", label: "Years of Service" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-3 items-center">
                <h4 className="text-3xl lg:text-4xl font-medium">
                  {stat.value}
                </h4>
                <p className="text-base lg:text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>
      {/* App Download Section */}
      <Wrapper className="relative z-10 py-20 md:py-24 lg:py-32 flex flex-col items-center gap-8 md:gap-10">
        <h2 className="text-[#20333C] text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          AOEK is now also available on Android & iOS
        </h2>

        <div className="w-full max-w-[1000px]">
          <Image
            src="/app-download.webp"
            width={1000}
            height={600}
            alt="App download preview"
            className="w-full object-contain"
            sizes="(max-width: 1200px) 90vw, 1000px"
          />
        </div>

        <h3 className="text-3xl md:text-4xl font-bold">Download Now</h3>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
          <Button
            asChild
            className="font-bold w-full sm:w-48 shadow-xl"
            variant="destructive"
          >
            <Link href="/">For Android</Link>
          </Button>
          <Button
            asChild
            className="font-bold w-full sm:w-48 shadow-xl"
            variant="destructive"
          >
            <Link href="/">For iOS</Link>
          </Button>
        </div>
      </Wrapper>
    </main>
  );
}
