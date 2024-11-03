import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import { siteConfig } from "@/config/site";

export default function NonFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="min-h-full h-full">
        <section className="bg-[#e5dfca]" style={{ minHeight: "890px" }}>
          {children}
        </section>
       </main>
      {/* <footer className="w-full h-full py-2" style={{backgroundColor: "#102530"}}>

        <div className="flex justify-between">
          <div className="flex justify-between items-center">
            <img src="/meow-woof-social-logo.svg" alt="SVG Icon" width={120} height={120} />
            <p className="font-bold text-inherit" style={{color: "#FFF"}}>MeowWoofSocial</p>
          </div>
          <div className="flex justify-between items-center pr-10">
            <a className="pr-5" style={{fontSize: "30px"}} href={siteConfig.links.facebook} title="Facebook">
              <FaFacebook className="text-default-500"/>
            </a>
            <a className="pr-5" style={{fontSize: "30px"}} href={siteConfig.links.tiktok} title="Tiktok">
              <FaTiktok className="text-default-500"/>
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <span style={{color: "#FFF"}}>Copyright © 2024 MeowWoof Social. All Rights Reserved.</span>
        </div> */}
        {/* <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        > */}
          {/* <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p> */}
        {/* </Link> */}
      {/* </footer> */}
    </div>
  );
}
