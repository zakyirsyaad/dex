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
import { Check } from "lucide-react";

interface FormError {
  message: string;
}

export default function DepositForm() {
  const { address } = useAccount();
  const { USDCAllowance } = useGetAllowance();

  const [amount, setAmount] = React.useState<string>("");
  const [error, setError] = React.useState<FormError | null>(null);
  const [statusApprove, setStatusApprove] = React.useState<boolean>(false);
  const [statusDeposit, setStatusDeposit] = React.useState<boolean>(false);

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

  async function handleApprove() {
    try {
      await writeContractAsyncApprove({
        address: UsdcContractAddress,
        abi: UsdcContractABI,
        functionName: "approve",
        args: [VaultContractAddress, parseUnits(amount, 6)],
      });
    } catch (err) {
      console.error(err);
      toast.error("Approval failed. Please try again.");
    }
  }

  React.useEffect(() => {
    if (isErrorApprove) {
      toast.error("Approval failed. Please try again.", {
        description: String(failureReasonApprove),
      });
    }
    if (isSuccessApprove) {
      toast.success("Approval successful!");
      setStatusApprove(true);
    }
    if (isErrorDeposit) {
      toast.error("Deposit failed. Please try again.", {
        description: String(failureReasonDeposit),
      });
    }
    if (isSuccessDeposit) {
      toast.success("Deposit successful!");
      setStatusDeposit(true);
    }
  }, [
    isSuccessApprove,
    isErrorApprove,
    failureReasonApprove,
    isSuccessDeposit,
    isErrorDeposit,
    failureReasonDeposit,
  ]);

  async function handleConfirm() {
    if (amount > USDCAllowance) {
      handleApprove();
    }
    toast.success("Approval successful!");
    await writeContractAsyncDeposit({
      address: VaultContractAddress,
      abi: VaultContractABI,
      functionName: "deposit",
      args: [parseUnits(amount, 6)],
    });
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(value)) {
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
      maximumFractionDigits: 20,
    });
  };

  function getButtonText() {
    if (isPendingApprove) return "Waiting for approval";
    if (isConfirmingApprove) return "Confirming approval";
    if (isPendingDeposit) return "Waiting for deposit";
    if (isConfirmingDeposit) return "Confirming deposit";
    return "Confirm Deposit";
  }

  // function status() {}

  return (
    <section className="space-y-4 pb-5">
      <div className="border rounded-md p-5">
        <h1 className="text-lg font-semibold mb-2">Send</h1>
        <div className="flex  -center gap-2">
          <input
            type="text"
            className="text-3xl border-none outline-none w-full"
            placeholder="0.00"
            value={formatDisplayAmount(amount)}
            onChange={handleAmountChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirm();
              }
            }}
            disabled={
              isPendingApprove ||
              isConfirmingApprove ||
              isPendingDeposit ||
              isConfirmingDeposit
            }
          />
          <TokenList />
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
      </div>

      {address ? (
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={handleConfirm}
            disabled={
              isPendingApprove ||
              isConfirmingApprove ||
              isPendingDeposit ||
              isConfirmingDeposit
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
      {statusApprove && (
        <Alert>
          <Check />
          <AlertTitle>Approval successful!</AlertTitle>
          <AlertDescription>
            You can now deposit USDC to the vault.
          </AlertDescription>
        </Alert>
      )}
      {/* 
      {statusApprove && (
        <p className="text-center text-muted-foreground">
          Approval successful!
        </p>
      )} */}
      {statusDeposit && (
        <Alert>
          <Check />
          <AlertTitle>Deposit successful!</AlertTitle>
          <AlertDescription>
            Now, you can achieve balance in your vault. Refresh the page if no
            changes are reflected in your balance.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
