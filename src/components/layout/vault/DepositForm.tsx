"use client";
import React from "react";
import TokenList from "@/components/TokenList";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import useGetAllowance from "@/hooks/getAllowance";
import { UsdcContractABI } from "@/contracts/UsdcContract";
import { UsdcContractAddress } from "@/contracts/UsdcContract";
import {
  VaultContractABI,
  VaultContractAddress,
} from "@/contracts/VaultContract";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Loader2 } from "lucide-react";

const USDC_DECIMALS = 6;
const MAX_DECIMAL_PLACES = 6;
const MIN_AMOUNT = 0.000001;

export default function DepositForm() {
  const { address } = useAccount();
  const { USDCAllowance, isLoadingUSDC, refetchAllowance } = useGetAllowance();

  const [amount, setAmount] = React.useState<string>("");
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const [isDeposited, setIsDeposited] = React.useState<boolean>(false);

  const {
    writeContractAsync: writeContractAsyncApprove,
    data: hashApprove,
    isPending: isPendingApprove,
  } = useWriteContract();

  const {
    writeContractAsync: writeContractAsyncDeposit,
    data: hashDeposit,
    isPending: isPendingDeposit,
  } = useWriteContract();

  const { isLoading: isConfirmingApprove, isSuccess: isSuccessApprove } =
    useWaitForTransactionReceipt({
      hash: hashApprove,
    });

  const { isLoading: isConfirmingDeposit, isSuccess: isSuccessDeposit } =
    useWaitForTransactionReceipt({
      hash: hashDeposit,
    });

  const validateAmount = (value: string): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (num < MIN_AMOUNT) return false;
    if (num > Number.MAX_SAFE_INTEGER) return false;
    return true;
  };

  async function handleApprove() {
    try {
      if (!validateAmount(amount)) {
        throw new Error("Invalid amount");
      }
      await writeContractAsyncApprove({
        address: UsdcContractAddress,
        abi: UsdcContractABI,
        functionName: "approve",
        args: [VaultContractAddress, parseUnits(amount, USDC_DECIMALS)],
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeposit() {
    try {
      await writeContractAsyncDeposit({
        address: VaultContractAddress,
        abi: VaultContractABI,
        functionName: "deposit",
        args: [parseUnits(amount, USDC_DECIMALS)],
      });
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed. Please try again.");
    }
  }

  async function handleConfirm() {
    try {
      if (!validateAmount(amount)) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (parseFloat(amount) > parseFloat(USDCAllowance)) {
        await handleApprove();
      }
      await handleDeposit();
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed. Please try again.");
    }
  }

  React.useEffect(() => {
    if (isSuccessApprove) {
      setIsApproved(true);
      refetchAllowance();
    }
    if (isSuccessDeposit) {
      setIsDeposited(true);
    }
  }, [isSuccessApprove, isSuccessDeposit, refetchAllowance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(value)) {
      // Limit decimal places
      const parts = value.split(".");
      if (parts[1] && parts[1].length > MAX_DECIMAL_PLACES) {
        return;
      }
      setAmount(value);
    }
  };

  function getButtonText() {
    if (isPendingApprove) {
      return "Waiting for approval...";
    }
    if (isConfirmingApprove) {
      return "Confirming approval...";
    }
    if (isPendingDeposit) {
      return "Waiting for deposit...";
    }
    if (isConfirmingDeposit) {
      return "Confirming deposit...";
    }
    return "Confirm Deposit";
  }

  const isLoading =
    isPendingApprove ||
    isConfirmingApprove ||
    isPendingDeposit ||
    isConfirmingDeposit;

  return (
    <section className="space-y-4 pb-5">
      <div className="border rounded-md p-5">
        <h1 className="text-lg font-semibold mb-2">Send</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="text-3xl border-none outline-none w-full bg-transparent"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleConfirm();
                }
              }}
              disabled={isLoading || isLoadingUSDC}
            />
            {isLoading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
          </div>
          <TokenList />
        </div>
      </div>

      {address ? (
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={handleConfirm}
            disabled={
              isLoading || isLoadingUSDC || !amount || parseFloat(amount) === 0
            }
          >
            {getButtonText()}
          </Button>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Connect your wallet to deposit
        </p>
      )}

      {isApproved && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            Approval successful!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Your USDC has been approved for the vault. Refresh the page if no
            changes are reflected in your balance.
          </AlertDescription>
        </Alert>
      )}

      {isDeposited && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            Deposit successful!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Your USDC has been deposited to the vault. Refresh the page if no
            changes are reflected in your balance.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
