"use client";
import { ArrowDownUp, HandCoins, Package, Tractor } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Menu() {
  const pathname = usePathname();
  return (
    <section className="grid grid-cols-4 gap-5 items-center text-sm">
      <Link
        href="/vault"
        className={`border place-items-center rounded-md py-2 ${
          pathname === "/vault" ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        <Package className="size-5" />
        Vault
      </Link>
      <Link href="/" className="border place-items-center rounded-md py-2">
        <ArrowDownUp className="size-5" />
        Swap
      </Link>
      <Link href="/" className="border place-items-center rounded-md py-2">
        <HandCoins className="size-5" />
        Staking
      </Link>
      <Link href="/" className="border place-items-center rounded-md py-2">
        <Tractor className="size-5" />
        Farming
      </Link>
    </section>
  );
}
