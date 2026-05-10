export const COW_CLICKER_ADDRESS =
  "0x380858A67A395400ef6f17dC5f00276D46f3E4e5" as const;

export const BASE_USDC_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

export const TIP_AMOUNT = BigInt(100_000); // 0.10 USDC (6 decimals)

export const cowClickerAbi = [
  {
    type: "function",
    name: "click",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tip",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getUser",
    inputs: [{ name: "_userAddress", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "addr", type: "address" },
          { name: "clicks", type: "uint256" },
          { name: "updatedAt", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastClicker",
    inputs: [],
    outputs: [
      { name: "addr", type: "address" },
      { name: "clicks", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

export const AAVE_V3_POOL_ADDRESS =
  "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5" as const;

export const aavePoolAbi = [
  {
    type: "function",
    name: "renouncePositionManagerRole",
    inputs: [{ name: "user", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;
