"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Token } from "@/lib/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "./ui/button";
export default function TokenList({
  tokens,
  token,
  setToken,
}: {
  tokens: Token[];
  token: Token;
  setToken: (token: Token) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleTokenChange = (token: Token) => {
    setToken(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Image
            src={token?.icon}
            alt={token?.symbol}
            width={50}
            height={50}
            priority={true}
            className="size-5"
          />
          <p>{token?.symbol}</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>Select a token to swap</DialogDescription>
        </DialogHeader>
        <div className="h-[500px]">
          <ScrollArea className="h-[500px]">
            {tokens.map((token) => (
              <div
                key={token.id}
                onClick={() => handleTokenChange(token)}
                className="hover:bg-primary/20 duration-200 cursor-pointer rounded-md p-2 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={token.icon}
                    alt={token.symbol}
                    width={50}
                    height={50}
                    priority={true}
                    className="size-10 rounded-full"
                  />
                  <div>
                    <p>{token.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {token.symbol}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
