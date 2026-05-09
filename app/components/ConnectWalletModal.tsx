"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useConnection, useConnect, useConnectors, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

import { activeChain } from "../wagmi";

import { resolveTheme, type WalletTheme } from "./wallet-theme";

type ConnectWalletModalProps = {
  open: boolean;
  onClose: () => void;
  theme?: WalletTheme;
};

const BaseIcon = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0 rounded-md"
  >
    <path
      d="M3.0009 4.70623C3.0009 4.12129 3.0009 3.82882 3.11069 3.60474C3.21598 3.38966 3.39056 3.21508 3.60564 3.10979C3.82972 3 4.12219 3 4.70623 3H19.2938C19.8787 3 20.1703 3 20.3953 3.10979C20.6103 3.21508 20.784 3.39056 20.8893 3.60474C21 3.82972 21 4.12219 21 4.70623V19.2938C21 19.8787 21 20.1703 20.8893 20.3953C20.784 20.6103 20.6094 20.784 20.3953 20.8893C20.1703 21 19.8778 21 19.2938 21H4.70623C4.12129 21 3.82972 21 3.60474 20.8893C3.38966 20.784 3.21598 20.6094 3.11069 20.3953C3 20.1703 3 19.8778 3 19.2938V4.70623H3.0009Z"
      fill="#0000FF"
    />
  </svg>
);

const WalletConnectIcon = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0 rounded-md"
  >
    <path d="M24 0H0V24H24V0Z" fill="#3B99FC" />
    <path
      d="M7.27553 9.07563C9.88479 6.57473 14.1152 6.57473 16.7245 9.07563L17.0385 9.37662C17.169 9.50166 17.169 9.7044 17.0385 9.82944L15.9643 10.8591C15.8991 10.9216 15.7933 10.9216 15.7281 10.8591L15.2959 10.4449C13.4756 8.70017 10.5244 8.70017 8.7041 10.4449L8.24131 10.8885C8.17608 10.951 8.07032 10.951 8.00509 10.8885L6.93086 9.85882C6.8004 9.73377 6.8004 9.53102 6.93086 9.40598L7.27553 9.07563ZM18.9461 11.205L19.9022 12.1214C20.0326 12.2464 20.0326 12.4492 19.9022 12.5742L15.5912 16.7062C15.4607 16.8313 15.2492 16.8313 15.1187 16.7062L12.0591 13.7736C12.0265 13.7424 11.9736 13.7424 11.941 13.7736L8.88138 16.7062C8.75092 16.8313 8.5394 16.8313 8.40893 16.7062L4.09785 12.5742C3.96738 12.4491 3.96738 12.2464 4.09785 12.1213L5.05391 11.205C5.18438 11.0799 5.3959 11.0799 5.52636 11.205L8.58606 14.1376C8.61868 14.1689 8.67156 14.1689 8.70418 14.1376L11.7637 11.205C11.8942 11.0799 12.1057 11.0799 12.2362 11.205L15.2959 14.1376C15.3285 14.1689 15.3814 14.1689 15.414 14.1376L18.4736 11.205C18.6041 11.08 18.8156 11.08 18.9461 11.205Z"
      fill="white"
    />
  </svg>
);

const MetaMaskIcon = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0 rounded-md"
  >
    <rect width="24" height="24" rx="4" fill="#F5841F" />
    <path
      d="M18.94 5.27l-5.16 3.84 .96-2.25 4.2-1.59z"
      fill="#E2761B"
      stroke="#E2761B"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.05 5.27l5.12 3.87-.91-2.28-4.21-1.59zM16.7 15.53l-1.37 2.1 2.94.81.84-2.87-2.41-.04zM4.9 15.57l.84 2.87 2.94-.81-1.37-2.1-2.41.04z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.49 11.15l-.82 1.24 2.92.13-.1-3.14-2 1.77zM15.5 11.15l-2.03-1.8-.07 3.17 2.92-.13-.82-1.24zM8.68 17.63l1.76-.86-1.52-1.19-.24 2.05zM13.55 16.77l1.77.86-.25-2.05-1.52 1.19z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.32 17.63l-1.77-.86.14 1.15-.02.48 1.65-.77zM8.68 17.63l1.65.77-.01-.48.13-1.15-1.77.86z"
      fill="#D7C1B3"
      stroke="#D7C1B3"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.36 14.47l-1.47-.43 1.04-.48.43.91zM13.63 14.47l.43-.91 1.04.48-1.47.43z"
      fill="#233447"
      stroke="#233447"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.68 17.63l.25-2.1-1.62.04 1.37 2.06zM15.07 15.53l.25 2.1 1.38-2.06-1.63-.04zM16.32 12.39l-2.92.13.27 1.95.43-.91 1.04.48 1.18-1.65zM8.89 14.04l1.04-.48.43.91.27-1.95-2.92-.13 1.18 1.65z"
      fill="#CD6116"
      stroke="#CD6116"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.67 12.39l1.22 2.38-.04-1.19-1.18-1.19zM15.14 13.58l-.05 1.19 1.23-2.38-1.18 1.19zM10.59 12.52l-.27 1.95.34 1.76.08-2.32-.15-1.39zM13.4 12.52l-.14 1.38.07 2.33.34-1.76-.27-1.95z"
      fill="#E4751F"
      stroke="#E4751F"
      strokeWidth=".06"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CONNECTOR_ICONS: Record<string, ReactNode> = {
  walletConnect: WalletConnectIcon,
};

function connectorIcon(connector: { id: string; icon?: string }): ReactNode {
  const fallback = CONNECTOR_ICONS[connector.id];
  if (fallback) return fallback;
  if (connector.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={connector.icon}
        alt=""
        width={32}
        height={32}
        className="shrink-0 rounded-md"
      />
    );
  }
  return null;
}

const DIALOG: Record<WalletTheme, string> = {
  light: "border-[#e2e3e5] bg-white text-[#000]",
  dark: "border-[#1e2025] bg-black text-white",
};

const CLOSE_BTN: Record<WalletTheme, string> = {
  light: "text-[#5b616e] hover:text-[#000]",
  dark: "text-[#8a919e] hover:text-white",
};

const CONNECTOR_ROW: Record<WalletTheme, string> = {
  light: "border-[#e2e3e5] hover:bg-[#f8f9fb] text-[#000]",
  dark: "border-[#1e2025] hover:bg-[#0d0e12] text-white",
};

const DIVIDER: Record<WalletTheme, string> = {
  light: "border-[#e2e3e5] text-[#5b616e]",
  dark: "border-[#1e2025] text-[#8a919e]",
};

const MUTED: Record<WalletTheme, string> = {
  light: "text-[#5b616e]",
  dark: "text-[#8a919e]",
};

const HARDCODED_OTHER_IDS = new Set([
  "walletConnect",
  "io.metamask",
  "io.metamask.mobile",
]);

export function ConnectWalletModal({
  open,
  onClose,
  theme: themeProp,
}: ConnectWalletModalProps) {
  const theme = resolveTheme(themeProp);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const allConnectors = useConnectors();
  const { connect, isPending } = useConnect();
  const { isConnected } = useConnection();
  const { disconnect } = useDisconnect();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with native <dialog> open/close
      setConnectingId(null);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        if (dialog.open) dialog.close();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (isConnected && open) onClose();
  }, [isConnected, open, onClose]);

  const handleDialogClose = useCallback(() => {
    if (open) onClose();
  }, [open, onClose]);

  const handleConnect = useCallback(
    (connector: (typeof allConnectors)[number]) => {
      setConnectingId(connector.uid);
      connect(
        { connector, chainId: activeChain.id },
        { onSettled: () => setConnectingId(null) },
      );
      onClose();
    },
    [connect, onClose],
  );

  const handleMetaMask = useCallback(() => {
    setConnectingId("metamask");
    const connector = injected({ target: "metaMask" });
    connect(
      { connector, chainId: activeChain.id },
      { onSettled: () => setConnectingId(null) },
    );
    onClose();
  }, [connect, onClose]);

  const baseAccountConnector = useMemo(
    () => allConnectors.find((c) => c.id === "baseAccount"),
    [allConnectors],
  );

  const walletConnectConnector = useMemo(
    () => allConnectors.find((c) => c.id === "walletConnect"),
    [allConnectors],
  );

  const discoveredWallets = useMemo(() => {
    const seen = new Set<string>();
    return allConnectors.filter((c) => {
      if (c.id === "injected" && c.name === "Injected") return false;
      if (c.id === "baseAccount" || c.id === "walletConnect") return false;
      if (HARDCODED_OTHER_IDS.has(c.id)) return false;
      if (c.name === "MetaMask") return false;
      const label = c.name;
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }, [allConnectors]);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      className={`fixed top-1/2 left-1/2 -translate-1/2  max-w-sm w-full rounded-2xl border p-0 transition-all duration-150 ease-out backdrop:transition-colors backdrop:duration-150 ${DIALOG[theme]} ${
        visible
          ? "opacity-100 scale-100 backdrop:bg-black/80"
          : "opacity-0 scale-95 backdrop:bg-black/0"
      }`}
    >
      <div className="flex justify-end px-5 pt-5">
        <button
          type="button"
          onClick={onClose}
          className={`transition-colors ${CLOSE_BTN[theme]}`}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <h2 className="text-lg font-semibold text-center px-6 pb-5">
        Connect Wallet
      </h2>

      <div className="px-5">
        {baseAccountConnector && (
          <button
            type="button"
            onClick={() => handleConnect(baseAccountConnector)}
            disabled={isPending}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors disabled:opacity-50 text-left ${CONNECTOR_ROW[theme]}`}
          >
            {BaseIcon}
            <span className="text-sm font-semibold flex-1">
              Sign in with Base
            </span>
            {connectingId === baseAccountConnector.uid && (
              <span className={`text-xs ${MUTED[theme]}`}>Connecting…</span>
            )}
          </button>
        )}
      </div>

      <div className={`flex items-center gap-3 px-5 py-4 ${DIVIDER[theme]}`}>
        <div className="flex-1 border-t border-current opacity-20" />
        <span className="text-xs">or use another wallet</span>
        <div className="flex-1 border-t border-current opacity-20" />
      </div>

      <div className="px-5 pb-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleMetaMask}
          disabled={isPending}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors disabled:opacity-50 text-left ${CONNECTOR_ROW[theme]}`}
        >
          {MetaMaskIcon}
          <span className="text-sm font-medium flex-1">MetaMask</span>
          {connectingId === "metamask" && (
            <span className={`text-xs ${MUTED[theme]}`}>Connecting…</span>
          )}
        </button>

        {walletConnectConnector && (
          <button
            type="button"
            onClick={() => handleConnect(walletConnectConnector)}
            disabled={isPending}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors disabled:opacity-50 text-left ${CONNECTOR_ROW[theme]}`}
          >
            {WalletConnectIcon}
            <span className="text-sm font-medium flex-1">WalletConnect</span>
            {connectingId === walletConnectConnector.uid && (
              <span className={`text-xs ${MUTED[theme]}`}>Connecting…</span>
            )}
          </button>
        )}

        {discoveredWallets.map((connector) => (
          <button
            key={connector.uid}
            type="button"
            onClick={() => handleConnect(connector)}
            disabled={isPending}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors disabled:opacity-50 text-left ${CONNECTOR_ROW[theme]}`}
          >
            {connectorIcon(connector)}
            <span className="text-sm font-medium flex-1">{connector.name}</span>
            {connectingId === connector.uid && (
              <span className={`text-xs ${MUTED[theme]}`}>Connecting…</span>
            )}
          </button>
        ))}

        {isConnected && (
          <button
            type="button"
            onClick={() => {
              disconnect();
              onClose();
            }}
            className={`w-full text-sm py-2.5 rounded-xl border transition-colors mt-1 ${CONNECTOR_ROW[theme]}`}
          >
            Disconnect
          </button>
        )}
      </div>
    </dialog>
  );
}
