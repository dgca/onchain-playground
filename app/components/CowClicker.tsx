"use client";

import { useState } from "react";
import { useConnection, useReadContract, useWriteContract } from "wagmi";

import {
  AAVE_V3_POOL_ADDRESS,
  BASE_USDC_ADDRESS,
  COW_CLICKER_ADDRESS,
  TIP_AMOUNT,
  aavePoolAbi,
  cowClickerAbi,
  erc20Abi,
} from "../contracts/cowClicker";
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
  const { mutate: mutateApprove, isPending: isApproving } = useWriteContract();
  const { mutate: mutateTip, isPending: isTipping } = useWriteContract();
  const { mutate: mutateRenounce, isPending: isRenouncing } =
    useWriteContract();

  const clicks = user ? Number(user.clicks) : 0;
  const lastClickedAt = user?.updatedAt ? Number(user.updatedAt) : 0;

  function handleApprove() {
    mutateApprove(
      {
        address: BASE_USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [COW_CLICKER_ADDRESS, TIP_AMOUNT],
        ...(appendSuffix && { dataSuffix: DATA_SUFFIX }),
      },
      {
        onSuccess: () => debugLog("info", "approve succeeded"),
        onError: (error) => {
          const err = error as Record<string, unknown>;
          debugLog("error", "approve error", {
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

  function handleTip() {
    mutateTip(
      {
        address: COW_CLICKER_ADDRESS,
        abi: cowClickerAbi,
        functionName: "tip",
        args: [TIP_AMOUNT],
        ...(appendSuffix && { dataSuffix: DATA_SUFFIX }),
      },
      {
        onSuccess: () => debugLog("info", "tip succeeded"),
        onError: (error) => {
          const err = error as Record<string, unknown>;
          debugLog("error", "tip error", {
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

  function handleRenounce() {
    mutateRenounce(
      {
        address: AAVE_V3_POOL_ADDRESS,
        abi: aavePoolAbi,
        functionName: "renouncePositionManagerRole",
        args: [COW_CLICKER_ADDRESS],
        ...(appendSuffix && { dataSuffix: DATA_SUFFIX }),
      },
      {
        onSuccess: () => debugLog("info", "renounce succeeded"),
        onError: (error) => {
          const err = error as Record<string, unknown>;
          debugLog("error", "renounce error", {
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

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleApprove}
          disabled={isApproving}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isApproving ? "Approving…" : "Approve $0.10 USDC"}
        </button>
        <button
          type="button"
          onClick={handleTip}
          disabled={isTipping}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isTipping ? "Tipping…" : "Tip the Cow"}
        </button>
      </div>

      <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleRenounce}
          disabled={isRenouncing}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isRenouncing ? "Sending…" : "Aave Renounce PM"}
        </button>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs text-center">
          This action is here to test clear signing on hardware wallet devices.
          It calls Aave V3&apos;s renouncePositionManagerRole with the
          CowClicker contract&apos;s address as its argument.
        </p>
      </div>
    </div>
  );
}
