"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";

import { debugLog } from "./useDebugLog";

export function useWalletLogger() {
  const { address, connector, chain, isConnected } = useAccount();
  const logged = useRef(false);

  useEffect(() => {
    if (!isConnected || !connector || logged.current) return;
    logged.current = true;

    debugLog("info", "wallet connected", {
      address,
      chainId: chain?.id,
      chainName: chain?.name,
    });

    debugLog("info", "connector", {
      id: connector.id,
      name: connector.name,
      type: connector.type,
      uid: connector.uid,
      rdns: connector.rdns,
      icon: connector.icon ? "(present)" : "(none)",
    });

    connector
      .getProvider()
      .then((provider: unknown) => {
        if (!provider || typeof provider !== "object") {
          debugLog("warn", "provider", "(unavailable)");
          return;
        }

        const p = provider as Record<string, unknown>;
        const flags: Record<string, unknown> = {};

        const knownFlags = [
          "isMetaMask",
          "isCoinbaseWallet",
          "isBraveWallet",
          "isRabby",
          "isTrust",
          "isLedgerLive",
          "isFrame",
          "isTrezor",
          "isOneKey",
          "isPhantom",
          "isZerion",
          "isTokenPocket",
          "isOKExWallet",
          "isBitKeep",
          "isSafePal",
          "isExodus",
        ];

        for (const flag of knownFlags) {
          if (p[flag]) flags[flag] = p[flag];
        }

        debugLog("info", "provider flags", flags);

        if (typeof p.request === "function" && address) {
          (
            p.request as (args: {
              method: string;
              params: unknown[];
            }) => Promise<unknown>
          )({
            method: "wallet_getCapabilities",
            params: [address],
          })
            .then((caps) => debugLog("info", "wallet_getCapabilities", caps))
            .catch(() =>
              debugLog("warn", "wallet_getCapabilities", "not supported"),
            );
        }
      })
      .catch(() => debugLog("warn", "provider", "failed to get"));
  }, [isConnected, connector, address, chain]);

  useEffect(() => {
    if (!isConnected) {
      logged.current = false;
    }
  }, [isConnected]);
}
