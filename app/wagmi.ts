import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount, injected, walletConnect } from "wagmi/connectors";

export const activeChain = base;

const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;

export function createWagmiConfig() {
  return createConfig({
    chains: [activeChain],
    connectors: [
      baseAccount({
        appName: "Onchain Playground",
        appLogoUrl: "/favicon.ico",
      }),
      injected(),
      ...(wcProjectId ? [walletConnect({ projectId: wcProjectId })] : []),
    ],
    transports: {
      [activeChain.id]: http(baseRpcUrl || undefined),
    },
    ssr: true,
  });
}
