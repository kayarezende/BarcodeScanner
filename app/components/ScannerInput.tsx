"use client";

import { useRef, useEffect } from "react";

interface ScannerInputProps {
  onScan: (barcode: string) => void;
}

export function ScannerInput({ onScan }: ScannerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const value = e.currentTarget.value.trim();
      if (value) {
        onScan(value);
        e.currentTarget.value = "";
      }
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Scan or type a barcode..."
      onKeyDown={handleKeyDown}
      onBlur={() => setTimeout(() => {
        const active = document.activeElement;
        if (!active || active === document.body || active === inputRef.current) {
          inputRef.current?.focus();
        }
      }, 100)}
      className="w-full rounded-lg border-2 border-zinc-300 p-4 text-lg outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );
}
