import Link from "next/link";
import Image from "next/image";
import { FaFacebookSquare as Facebook } from "react-icons/fa";

const parentLinks = [
  {
    href: "https://www.pwd.kerala.gov.in/IMF_website/index/",
    label: "Kerala PWD",
  },
  { href: "http://www.lsgkerala.gov.in", label: "Kerala LSGD" },
  {
    href: "https://www.irrigation.kerala.gov.in",
    label: "Kerala Irrigation Dept",
  },
];

const usefulLinks = [
  {
    href: "https://www.etenders.kerala.gov.in/nicgep/app",
    label: "Tenders Kerala",
  },
  {
    href: "https://www.spark.gov.in/webspark/(S(hzae3zw3gds1sbhw5rulsk2p))/sparklogin.aspx",
    label: "Spark",
  },
  { href: "https://www.price.kerala.gov.in/price3_pmu/", label: "PRICE" },
  {
    href: "https://khri.kerala.gov.in/",
    label: "Kerala Highway Research Institute",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#20333C] space-y-10 text-white relative z-20">
      <div className="h-[0.5px] bg-gray-500 mx-auto max-w-7xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-white gap-5 max-w-7xl mx-auto p-5">
        <div>
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/aoek-logo.webp" alt="logo" width={60} height={60} />
            <span className="text-2xl font-bold text-white tracking-wider">
              AOEK
            </span>
          </Link>
        </div>

        {/* Parent Links */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-semibold mb-4 underline">Parent Links</h3>
          <ul className="space-y-5">
            {parentLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target="_blank"
                  className="hover:text-[#FACE30] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-semibold mb-4 underline">Useful Links</h3>
          <ul className="space-y-5">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target="_blank"
                  className="hover:text-[#FACE30] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-semibold mb-4 underline">Socials</h3>
          <Link
            href={"https://www.facebook.com/aoek"}
            target="_blank"
            className="block"
          >
            <Facebook size={32} className="text-white" />
          </Link>
        </div>
      </div>
      <div className="h-[0.5px] bg-gray-500 mx-auto max-w-7xl" />
      <div className="w-full text-center text-white pb-5">
        <span className="font-bold">AOEK</span> &copy;{" "}
        {new Date().getFullYear()} - Powered by Ervinor
      </div>
    </footer>
  );
}
