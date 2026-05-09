"use client";

import { useState } from "react";
import { useConnection, useReadContract, useWriteContract } from "wagmi";

import { COW_CLICKER_ADDRESS, cowClickerAbi } from "../contracts/cowClicker";
import { debugLog } from "../hooks/useDebugLog";

const DATA_SUFFIX =
  "0x62635f796c3277617639750b0080218021802180218021802180218021" as const;

export function CowClicker() {
  const { address, isConnected } = useConnection();
  const [appendSuffix, setAppendSuffix] = useState(true);

  const { data: user, refetch } = useReadContract({
    address: COW_CLICKER_ADDRESS,
    abi: cowClickerAbi,
    functionName: "getUser",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { mutate, isPending } = useWriteContract();

  const clicks = user ? Number(user.clicks) : 0;
  const lastClickedAt = user?.updatedAt ? Number(user.updatedAt) : 0;

  function handleClick() {
    mutate(
      {
        address: COW_CLICKER_ADDRESS,
        abi: cowClickerAbi,
        functionName: "click",
        ...(appendSuffix && { dataSuffix: DATA_SUFFIX }),
      },
      {
        onSuccess: () => void refetch(),
        onError: (error) => {
          const err = error as Record<string, unknown>;
          debugLog("error", "transaction error", {
            code: err.code,
            message: err.message,
            data: err.data,
            cause: err.cause,
            details: err.details,
            name: err.name,
          });
        },
      },
    );
  }

  if (!isConnected) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        Connect your wallet to click the cow.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="text-8xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
      >
        🐄
      </button>

      <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
        <p>
          Clicks:{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {clicks}
          </span>
        </p>
        {lastClickedAt > 0 && (
          <p>
            Last clicked:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {new Date(lastClickedAt * 1000).toLocaleString()}
            </span>
          </p>
        )}
        <label className="flex items-center justify-center gap-2 pt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={appendSuffix}
            onChange={(e) => setAppendSuffix(e.target.checked)}
            className="accent-zinc-900 dark:accent-zinc-100"
          />
          <span>Append data suffix</span>
        </label>
      </div>
    </div>
  );
}
