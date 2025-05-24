import React from "react";
import SwapForm from "@/components/layout/swap/SwapForm";
import useGetToken from "@/hooks/getToken";
import useGetGasPrice from "@/hooks/getGasPrice";

export default async function page() {
  const tokens = await useGetToken();
  const gasPrice = await useGetGasPrice();
  
  return (
    <main>
      <SwapForm tokens={tokens} gasPrice={gasPrice} />
    </main>
  );
}
