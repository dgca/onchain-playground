"use client";

import { useWalletLogger } from "../hooks/useWalletLogger";

import { DebugConsole } from "./DebugConsole";

export function DebugPanel() {
  useWalletLogger();
  return <DebugConsole />;
}
