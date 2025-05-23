"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { parseUnits } from "viem";
import { toast } from "sonner";
import {
  VaultContractABI,
  VaultContractAddress,
} from "@/contracts/VaultContract";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
interface FormError {
  message: string;
}
interface FormError {
  message: string;
}

export default function WithdrawForm() {
  const { address } = useAccount();
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState<FormError | null>(null);

  const {
    writeContractAsync,
    data: hashWithdraw,
    isPending: isPendingWithdraw,
    isError: isErrorWithdraw,
    failureReason: failureReasonWithdraw,
  } = useWriteContract();

  const { isLoading: isConfirmingWithdraw, isSuccess: isSuccessWithdraw } =
    useWaitForTransactionReceipt({
      hash: hashWithdraw,
    });

  async function handleConfirm() {
    try {
      await writeContractAsync({
        address: VaultContractAddress,
        abi: VaultContractABI,
        functionName: "withdraw",
        args: [parseUnits(amount, 6)],
      });
    } catch (err) {
      console.error(err);
      toast.error("Withdraw failed. Please try again.");
    }
  }

  React.useEffect(() => {
    if (isErrorWithdraw) {
      toast.error("Withdraw failed. Please try again.", {
        description: String(failureReasonWithdraw),
      });
    }
    if (isSuccessWithdraw) {
      toast.success("Withdraw successful!");
    }
  }, [isErrorWithdraw, isSuccessWithdraw, failureReasonWithdraw]);

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
    if (isPendingWithdraw) return "Waiting for withdraw";
    if (isConfirmingWithdraw) return "Confirming withdraw";
    return "Confirm Withdraw";
  }

  return (
    <section className="space-y-4 pb-5">
      <div className="border rounded-md p-5">
        <h1 className="text-lg font-semibold mb-2">Recieve</h1>
        <div className="flex items-center gap-2">
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
          />
          <span className="font-semibold">USDC</span>
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
      </div>

      {address ? (
        <Button
          className="w-full"
          size={"lg"}
          onClick={handleConfirm}
          disabled={isPendingWithdraw || isConfirmingWithdraw}
        >
          {getButtonText()}
        </Button>
      ) : (
        <p className="text-center text-muted-foreground">
          Connect your wallet to withdraw
        </p>
      )}

      {isSuccessWithdraw && (
        <Alert>
          <Check />
          <AlertTitle>Withdraw successful!</AlertTitle>
          <AlertDescription>
            You have successfully withdrawn your balance from the vault. Please
            check your main balance, and refresh the page if there are no
            changes reflected in your balance.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
