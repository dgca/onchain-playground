"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";
import { createPublicClient, http } from "viem";
import { base, mainnet } from "viem/chains";
import { toCoinType } from "viem/ens";

import { activeChain } from "../wagmi";

const mainnetRpcUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(mainnetRpcUrl || undefined),
});

const BASE_COIN_TYPE = toCoinType(base.id);

export function useEnsIdentity(address: Address | undefined): {
  name: string | null;
  avatar: string | null;
} {
  const [name, setName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on address/chain change before fetching
    setName(null);
    setAvatar(null);
    if (!address) return;

    const cancelled = { value: false };

    (async () => {
      try {
        let resolved: string | null = null;

        if (activeChain.id === base.id) {
          resolved = await mainnetClient
            .getEnsName({ address, coinType: BASE_COIN_TYPE })
            .catch(() => null);
        }

        if (!resolved) {
          resolved = await mainnetClient
            .getEnsName({ address })
            .catch(() => null);
        }

        if (cancelled.value) return;
        setName(resolved);

        if (resolved) {
          const ensAvatar = await mainnetClient
            .getEnsAvatar({ name: resolved })
            .catch(() => null);
          if (!cancelled.value) setAvatar(ensAvatar);
        }
      } catch {
        if (!cancelled.value) {
          setName(null);
          setAvatar(null);
        }
      }
    })();

    return () => {
      cancelled.value = true;
    };
  }, [address]);

  return { name, avatar };
}
