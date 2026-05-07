"use client";

import { useRef, useEffect, useState } from "react";
import { useDebugLog, type LogEntry } from "../hooks/useDebugLog";

const LEVEL_COLORS: Record<LogEntry["level"], string> = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatData(data: unknown): string {
  if (data === undefined) return "";
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function DebugConsole() {
  const { log, clear } = useDebugLog();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log, open]);

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-0 mr-3 rounded-t-lg bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        {open ? "▼ console" : "▲ console"}
        {log.length > 0 && !open && (
          <span className="ml-1.5 rounded-full bg-zinc-700 px-1.5 text-[10px]">
            {log.length}
          </span>
        )}
      </button>

      {open && (
        <div className="w-screen sm:w-[480px] border-t border-zinc-700 bg-zinc-900/95 backdrop-blur">
          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
            <span className="text-xs font-mono font-medium text-zinc-400">
              Debug Console
            </span>
            <button
              type="button"
              onClick={clear}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              clear
            </button>
          </div>

          <div
            ref={scrollRef}
            className="h-60 overflow-y-auto p-2 font-mono text-xs/relaxed "
          >
            {log.length === 0 ? (
              <p className="text-zinc-600 py-4 text-center">No log entries</p>
            ) : (
              log.map((entry) => (
                <div
                  key={entry.id}
                  className="flex gap-2 py-0.5 border-b border-zinc-800/50"
                >
                  <span className="shrink-0 text-zinc-600">
                    {formatTime(entry.timestamp)}
                  </span>
                  <span className={`shrink-0 ${LEVEL_COLORS[entry.level]}`}>
                    {entry.level.padEnd(5)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-zinc-300">{entry.label}</span>
                    {entry.data !== undefined && (
                      <pre className="mt-0.5 whitespace-pre-wrap break-all text-zinc-500">
                        {formatData(entry.data)}
                      </pre>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
