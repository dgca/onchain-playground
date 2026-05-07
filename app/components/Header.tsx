"use client";

import { ConnectWalletButton } from "./ConnectWalletButton";

export function Header() {
  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-end border-b border-zinc-200 dark:border-zinc-800">
      <ConnectWalletButton />
    </header>
  );
}
