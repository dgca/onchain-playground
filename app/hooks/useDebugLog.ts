"use client";

import { useSyncExternalStore, useCallback } from "react";

type LogLevel = "info" | "warn" | "error";

export type LogEntry = {
  id: number;
  level: LogLevel;
  label: string;
  data: unknown;
  timestamp: Date;
};

let nextId = 0;
let entries: LogEntry[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return entries;
}

export function debugLog(level: LogLevel, label: string, data?: unknown) {
  entries = [
    ...entries,
    { id: nextId++, level, label, data, timestamp: new Date() },
  ];
  emit();
}

export function clearDebugLog() {
  entries = [];
  emit();
}

export function useDebugLog() {
  const log = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const info = useCallback(
    (label: string, data?: unknown) => debugLog("info", label, data),
    [],
  );
  const warn = useCallback(
    (label: string, data?: unknown) => debugLog("warn", label, data),
    [],
  );
  const error = useCallback(
    (label: string, data?: unknown) => debugLog("error", label, data),
    [],
  );

  return { log, info, warn, error, clear: clearDebugLog };
}
