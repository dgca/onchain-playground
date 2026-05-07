export type WalletTheme = "light" | "dark";

export function resolveTheme(theme: WalletTheme | undefined): WalletTheme {
  if (theme) return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
