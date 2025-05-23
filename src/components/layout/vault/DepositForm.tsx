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

interface FormError {
  message: string;
  code?: string;
}

type TransactionStatus =
  | "idle"
  | "approving"
  | "depositing"
  | "success"
  | "error";

export default function DepositForm() {
  const { address } = useAccount();
  const { USDCAllowance, isLoadingUSDC } = useGetAllowance();

  const [amount, setAmount] = React.useState<string>("");
  const [error, setError] = React.useState<FormError | null>(null);
  const [transactionStatus, setTransactionStatus] =
    React.useState<TransactionStatus>("idle");
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const [isDeposited, setIsDeposited] = React.useState<boolean>(false);

  const {
    writeContractAsync: writeContractAsyncApprove,
    data: hashApprove,
    isPending: isPendingApprove,
    isError: isErrorApprove,
    failureReason: failureReasonApprove,
  } = useWriteContract();

  const {
    writeContractAsync: writeContractAsyncDeposit,
    data: hashDeposit,
    isPending: isPendingDeposit,
    isError: isErrorDeposit,
    failureReason: failureReasonDeposit,
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
      setTransactionStatus("approving");
      setError(null);

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
      setError({
        message: "Approval failed. Please try again.",
        code: "APPROVE_ERROR",
      });
      setTransactionStatus("error");
      toast.error("Approval failed. Please try again.");
    }
  }

  React.useEffect(() => {
    if (isErrorApprove) {
      setError({
        message: String(failureReasonApprove),
        code: "APPROVE_ERROR",
      });
      setTransactionStatus("error");
      toast.error("Approval failed. Please try again.", {
        description: String(failureReasonApprove),
      });
    }
    if (isSuccessApprove) {
      setTransactionStatus("success");
      setIsApproved(true);
      toast.success("Approval successful!");
      handleDeposit();
    }
    if (isErrorDeposit) {
      setError({
        message: String(failureReasonDeposit),
        code: "DEPOSIT_ERROR",
      });
      setTransactionStatus("error");
      toast.error("Deposit failed. Please try again.", {
        description: String(failureReasonDeposit),
      });
    }
    if (isSuccessDeposit) {
      setTransactionStatus("success");
      setIsDeposited(true);
      toast.success("Deposit successful!");
    }
  }, [
    isSuccessApprove,
    isErrorApprove,
    failureReasonApprove,
    isSuccessDeposit,
    isErrorDeposit,
    failureReasonDeposit,
  ]);

  async function handleDeposit() {
    try {
      setTransactionStatus("depositing");
      await writeContractAsyncDeposit({
        address: VaultContractAddress,
        abi: VaultContractABI,
        functionName: "deposit",
        args: [parseUnits(amount, USDC_DECIMALS)],
      });
    } catch (err) {
      console.error(err);
      setError({
        message: "Transaction failed. Please try again.",
        code: "TRANSACTION_ERROR",
      });
      setTransactionStatus("error");
      toast.error("Transaction failed. Please try again.");
    }
  }

  async function handleConfirm() {
    try {
      setError(null);

      if (!validateAmount(amount)) {
        setError({
          message: "Please enter a valid amount",
          code: "INVALID_AMOUNT",
        });
        return;
      }

      if (parseFloat(amount) > parseFloat(USDCAllowance)) {
        await handleApprove();
        return;
      }

      await handleDeposit();
    } catch (err) {
      console.error(err);
      setError({
        message: "Transaction failed. Please try again.",
        code: "TRANSACTION_ERROR",
      });
      setTransactionStatus("error");
      toast.error("Transaction failed. Please try again.");
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(value)) {
      // Limit decimal places
      const parts = value.split(".");
      if (parts[1] && parts[1].length > MAX_DECIMAL_PLACES) {
        return;
      }
      setAmount(value);
      setError(null);
    }
  };

  const formatDisplayAmount = (value: string): string => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: MAX_DECIMAL_PLACES,
    });
  };

  function getButtonText() {
    switch (transactionStatus) {
      case "approving":
        return isConfirmingApprove
          ? "Confirming approval..."
          : "Waiting for approval...";
      case "depositing":
        return isConfirmingDeposit
          ? "Confirming deposit..."
          : "Waiting for deposit...";
      case "success":
        return "Transaction successful!";
      case "error":
        return "Transaction failed. Try again";
      default:
        return "Confirm Deposit";
    }
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
              value={formatDisplayAmount(amount)}
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
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
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
            You can now deposit USDC to the vault.
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
