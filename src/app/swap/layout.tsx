import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto px-5 sm:px-0 space-y-10">{children}</div>
  );
}
