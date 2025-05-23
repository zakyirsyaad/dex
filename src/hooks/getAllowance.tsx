"use client";
import { useAccount, useReadContract } from "wagmi";
import { UsdcContractAddress, UsdcContractABI } from "@/contracts/UsdcContract";
import { formatUnits } from "viem";
import { VaultContractAddress } from "@/contracts/VaultContract";
import React from "react";

export default function useGetAllowance() {
  const { address } = useAccount();

  const {
    data: USDCAllowance,
    isLoading: isLoadingUSDC,
    refetch: refetchAllowance,
  } = useReadContract({
    address: UsdcContractAddress,
    abi: UsdcContractABI,
    functionName: "allowance",
    args: [address, VaultContractAddress],
  });

  React.useEffect(() => {
    refetchAllowance();
  }, []);

  const formattedUSDCAllowance = USDCAllowance
    ? formatUnits(USDCAllowance as bigint, 6)
    : "0";

  return {
    USDCAllowance: formattedUSDCAllowance,
    isLoadingUSDC,
  };
}
