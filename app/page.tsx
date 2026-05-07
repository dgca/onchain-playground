import { CowClicker } from "./components/CowClicker";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Onchain Playground
      </h1>
      <CowClicker />
    </main>
  );
}
