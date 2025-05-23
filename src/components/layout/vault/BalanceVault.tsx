"use client";
import React from "react";
import useGetBalance from "@/hooks/getBalance";
import { Loader2 } from "lucide-react";
export default function BalanceVault() {
  const { VaultBalance, isLoadingVault } = useGetBalance();
  return (
    <div className="border rounded-md p-5 bg-secondary shadow">
      <h1 className="text-3xl font-semibold">
        {!VaultBalance && isLoadingVault ? (
          <p className="flex items-center gap-2 text-4xl text-muted-foreground">
            <Loader2 className="animate-spin" /> loading...
          </p>
        ) : (
          <p className="text-4xl font-semibold">
            {VaultBalance} <span className="text-2xl">Shares</span>
          </p>
        )}
      </h1>
      <h2 className="text-sm text-muted-foreground">
        Your vault balance in Shares
      </h2>
    </div>
  );
}
