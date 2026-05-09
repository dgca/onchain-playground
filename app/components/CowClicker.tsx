"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { COW_CLICKER_ADDRESS, cowClickerAbi } from "../contracts/cowClicker";
import { debugLog } from "../hooks/useDebugLog";

export function CowClicker() {
  const { address, isConnected } = useAccount();

  const { data: user, refetch } = useReadContract({
    address: COW_CLICKER_ADDRESS,
    abi: cowClickerAbi,
    functionName: "getUser",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, isPending } = useWriteContract();

  const clicks = user ? Number(user.clicks) : 0;
  const lastClickedAt = user?.updatedAt ? Number(user.updatedAt) : 0;

  function handleClick() {
    writeContract(
      {
        address: COW_CLICKER_ADDRESS,
        abi: cowClickerAbi,
        functionName: "click",
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
      </div>
    </div>
  );
}
