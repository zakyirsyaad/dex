import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepositForm from "@/components/layout/vault/DepositForm";
import WithdrawForm from "@/components/layout/vault/WithdrawForm";
import BalanceVault from "@/components/layout/vault/BalanceVault";

export default function page() {
  return (
    <section className="space-y-2">
      <BalanceVault />
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <DepositForm />
        </TabsContent>
        <TabsContent value="withdraw">
          <WithdrawForm />
        </TabsContent>
      </Tabs>
    </section>
  );
}
