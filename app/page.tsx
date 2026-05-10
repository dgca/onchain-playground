import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Onchain Playground
      </h1>
      <ul className="text-sm space-y-2 list-disc list-inside">
        <li>
          <Link
            href="/cow-clicker"
            className="text-blue-400 underline hover:text-blue-300 visited:text-purple-400 transition-colors"
          >
            Cow Clicker
          </Link>
        </li>
      </ul>
    </main>
  );
}
