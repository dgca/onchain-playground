"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnection, useDisconnect } from "wagmi";

import { activeChain } from "../wagmi";
import { useEnsIdentity } from "../hooks/useBaseName";
import { copyTextToClipboard } from "../utils/clipboard";

import { ConnectWalletModal } from "./ConnectWalletModal";
import { resolveTheme, type WalletTheme } from "./wallet-theme";

type ConnectWalletButtonProps = {
  theme?: WalletTheme;
};

const CONNECTED_BUTTON: Record<WalletTheme, string> = {
  light: "bg-[#efefef] text-[#262626] hover:bg-[#e0e0e0]",
  dark: "bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#333]",
};

const DROPDOWN: Record<WalletTheme, string> = {
  light: "border-[#e2e3e5] bg-white text-[#000]",
  dark: "border-[#1e2025] bg-black text-white",
};

const DROPDOWN_ITEM: Record<WalletTheme, string> = {
  light: "hover:bg-[#f8f9fb] text-[#000]",
  dark: "hover:bg-[#0d0e12] text-white",
};

export function ConnectWalletButton({
  theme: themeProp,
}: ConnectWalletButtonProps) {
  const { address, isConnected } = useConnection();
  const { disconnect } = useDisconnect();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { name: ensName } = useEnsIdentity(address);
  const theme = resolveTheme(themeProp);

  const handleClick = useCallback(() => {
    if (isConnected) {
      setDropdownOpen((prev) => !prev);
    } else {
      setModalOpen(true);
    }
  }, [isConnected]);

  const handleCopyAddress = useCallback(() => {
    if (!address) return;
    copyTextToClipboard(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setDropdownOpen(false);
    }, 1000);
  }, [address]);

  const handleDisconnect = useCallback(() => {
    setDropdownOpen(false);
    disconnect();
  }, [disconnect]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [dropdownOpen]);

  const displayLabel =
    isConnected && address
      ? (ensName ?? `${address.slice(0, 6)}…${address.slice(-4)}`)
      : "Connect Wallet";

  return (
    <>
      <div key="dropdown" className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleClick}
          className={`text-sm font-medium px-6 py-2.5 rounded-full transition-colors whitespace-nowrap ${
            isConnected
              ? CONNECTED_BUTTON[theme]
              : "bg-(--accent) text-white hover:opacity-90"
          }`}
        >
          {displayLabel}
        </button>

        {dropdownOpen && (
          <div
            className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg overflow-hidden z-50 ${DROPDOWN[theme]}`}
          >
            <div
              className={`text-xs px-4 py-2.5 border-b ${theme === "light" ? "border-[#e2e3e5]" : "border-[#1e2025]"}`}
              style={{
                color: theme === "light" ? "#9a9a9a" : "#666",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: theme === "light" ? "#262626" : "#e0e0e0",
                }}
              >
                Network:
              </span>
              <br />
              {activeChain.name}
            </div>
            <button
              type="button"
              onClick={handleCopyAddress}
              className={`w-full text-left text-sm px-4 py-3 transition-colors ${DROPDOWN_ITEM[theme]}`}
            >
              {copied ? "Copied!" : "Copy Address"}
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              className={`w-full text-left text-sm px-4 py-3 transition-colors ${DROPDOWN_ITEM[theme]}`}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
      <ConnectWalletModal
        open={modalOpen}
        onClose={handleCloseModal}
        theme={themeProp}
      />
    </>
  );
}
