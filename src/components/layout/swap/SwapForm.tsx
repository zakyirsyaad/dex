"use client";
import TokenList from "@/components/TokenList";
import { Button } from "@/components/ui/button";
import useGetQuote from "@/hooks/getQuote";
import { Token } from "@/lib/type";
import { ArrowDownUp } from "lucide-react";
import React from "react";
import { parseUnits } from "viem";
// import { ethers, Contract } from "ethers";
// import BigNumber from "bignumber.js";
import { useAccount } from "wagmi";
// import { ERC20Abi } from "@/contracts/ERC20Abi";

export default function SwapForm({
  tokens,
  gasPrice,
}: {
  tokens: Token[];
  gasPrice: number;
}) {
  // const { address } = useAccount();
  const [tokenIn, setTokenIn] = React.useState<Token>(tokens[0]);
  const [tokenOut, setTokenOut] = React.useState<Token>(tokens[1]);

  function handleSwap() {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  }

  const [amountIn, setAmountIn] = React.useState<string>("");
  const [amountOut, setAmountOut] = React.useState<string>("");

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmountIn(e.target.value);
  }

  // async function approve() {
  //   const rpcUrl = "https://arb1.arbitrum.io/rpc";
  //   let provider = new ethers.JsonRpcProvider(rpcUrl);
  //   const privateKey = address as `0x${string}`; //wallet address;
  //   const inTokenAddress = tokenIn.address; // token address
  //   const contractAddress = tokenIn.address; // contract address
  //   const wallet = new ethers.Wallet(privateKey, provider);
  //   const contract = await new Contract(inTokenAddress, ERC20Abi, wallet); // abi, erc20 abi

  //   try {
  //     await contract.approve(
  //       contractAddress,
  //       new BigNumber(
  //         "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  //       ).toFixed(0, 1)
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  //   return true;
  // }

  const quote = useGetQuote({
    inTokenAddress: tokenIn.address,
    outTokenAddress: tokenOut.address,
    amount: parseUnits(amountIn, tokenIn.decimals).toString(),
    gasPrice: gasPrice.toString(),
    slippage: "0.01",
  });

  React.useEffect(() => {
    const updateAmountOut = async () => {
      try {
        const quoteResult = await quote;
        if (quoteResult?.outAmount) {
          setAmountOut(quoteResult.outAmount);
        }
      } catch (error) {
        console.error("Error getting quote:", error);
      }
    };

    updateAmountOut();
  }, [quote]);

  // function handleConfirm() {
  //   // console.log(quote);
  // }

  return (
    <section className="flex flex-col items-center gap-2">
      <div className="border shadow rounded-md p-5">
        <h1 className="text-lg font-semibold mb-2">Sell</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="text-3xl border-none outline-none w-full"
            placeholder="0.00"
            value={amountIn}
            onChange={handleAmountChange}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     handleConfirm();
            //   }
            // }}
          />
          <TokenList tokens={tokens} token={tokenIn} setToken={setTokenIn} />
        </div>
        {/* {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>} */}
      </div>
      <Button onClick={handleSwap} variant={"outline"} size={"icon"}>
        <ArrowDownUp />
      </Button>
      <div className="border shadow rounded-md p-5">
        <h1 className="text-lg font-semibold mb-2">Buy</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="text-3xl border-none outline-none w-full"
            disabled
            placeholder="0.00"
            value={amountOut}
            onChange={handleAmountChange}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     handleConfirm();
            //   }
            // }}
          />
          <TokenList tokens={tokens} token={tokenOut} setToken={setTokenOut} />
        </div>
        {/* {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>} */}
      </div>
      <div className="self-start">
        <p className="text-sm text-muted-foreground">Gas price: {gasPrice}</p>
      </div>
    </section>
  );
}
