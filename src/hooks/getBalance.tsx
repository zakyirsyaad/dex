"use client";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { UsdcContractAddress, UsdcContractABI } from "@/contracts/UsdcContract";
import { formatUnits } from "viem";
import {
  VaultContractAddress,
  VaultContractABI,
} from "@/contracts/VaultContract";
import React from "react";

export default function useGetBalance() {
  const { address } = useAccount();

  const {
    data: ETHBalance,
    isLoading: isLoadingETH,
    refetch: refetchETH,
  } = useBalance({
    address,
    token: "0x0000000000000000000000000000000000000000",
  });

  const {
    data: USDCBalance,
    isLoading: isLoadingUSDC,
    refetch: refetchUSDC,
  } = useReadContract({
    address: UsdcContractAddress,
    abi: UsdcContractABI,
    functionName: "balanceOf",
    args: [address],
  });

  const {
    data: VaultBalance,
    isLoading: isLoadingVault,
    refetch: refetchVault,
  } = useReadContract({
    address: VaultContractAddress,
    abi: VaultContractABI,
    functionName: "balanceOf",
    args: [address],
  });

  React.useEffect(() => {
    refetchETH();
    refetchUSDC();
    refetchVault();
  }, [refetchETH, refetchUSDC, refetchVault]);

  const formattedETHBalance = ETHBalance
    ? formatUnits(ETHBalance.value, 18)
    : "0";
  const formattedUSDCBalance = USDCBalance
    ? formatUnits(USDCBalance as bigint, 6)
    : "0";
  const formattedVaultBalance = VaultBalance
    ? formatUnits(VaultBalance as bigint, 6)
    : "0";

  return {
    ETHBalance: formattedETHBalance,
    USDCBalance: formattedUSDCBalance,
    VaultBalance: formattedVaultBalance,
    isLoadingETH,
    isLoadingUSDC,
    isLoadingVault,
  };
}
