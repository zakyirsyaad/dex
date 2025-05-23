"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { ConnectButtonCustom } from "./ConnectButtonCustom";
import useGetBalance from "@/hooks/getBalance";
import { baseSepolia } from "viem/chains";

export default function CardBalance() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { USDCBalance, isLoadingUSDC } = useGetBalance();
  const { switchChain } = useSwitchChain();

  React.useEffect(() => {
    switchChain({ chainId: baseSepolia.id });
  }, [switchChain]);
  return (
    <Card>
      <CardHeader>
        {address ? (
          <>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => disconnect()}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription>Your balance account.</CardDescription>
          </>
        ) : (
          <div>
            <ConnectButtonCustom />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!USDCBalance && isLoadingUSDC ? (
          <p className="flex items-center gap-2 text-4xl text-muted-foreground">
            <Loader2 className="animate-spin" /> loading...
          </p>
        ) : (
          <p className="text-4xl font-semibold">$ {USDCBalance}</p>
        )}
      </CardContent>
      <CardFooter>
        <p>+0%</p>
      </CardFooter>
    </Card>
  );
}
