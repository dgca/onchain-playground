export const COW_CLICKER_ADDRESS =
  "0x380858A67A395400ef6f17dC5f00276D46f3E4e5" as const;

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
