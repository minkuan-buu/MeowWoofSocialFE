import { Navbar } from "@/components/navbar";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col h-full">
      <Navbar />
      {children}
    </div>
  );
}
