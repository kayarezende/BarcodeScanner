"use client";

import { useState, useRef } from "react";
import type { ProductEntry } from "../types";

interface ProductLibraryProps {
  entries: ProductEntry[];
  onAdd: (entry: ProductEntry) => void;
  onRemove: (barcode: string) => void;
  onUpdate: (barcode: string, name: string) => void;
}

export function ProductLibrary({ entries, onAdd, onRemove, onUpdate }: ProductLibraryProps) {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [editingBarcode, setEditingBarcode] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [search, setSearch] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmedBarcode = barcode.trim();
    const trimmedName = name.trim();
    if (!trimmedBarcode || !trimmedName) return;
    if (entries.some((entry) => entry.barcode === trimmedBarcode)) return;
    onAdd({ barcode: trimmedBarcode, name: trimmedName });
    setBarcode("");
    setName("");
    barcodeRef.current?.focus();
  }

  function startEdit(entry: ProductEntry) {
    setEditingBarcode(entry.barcode);
    setEditName(entry.name);
  }

  function saveEdit() {
    if (editingBarcode && editName.trim()) {
      onUpdate(editingBarcode, editName.trim());
    }
    setEditingBarcode(null);
  }

  const filtered = search
    ? entries.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.barcode.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const duplicate = entries.some((e) => e.barcode === barcode.trim());

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6 space-y-3">
        <div className="flex gap-3">
          <input
            ref={barcodeRef}
            type="text"
            placeholder="Scan or type barcode..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-1 rounded-lg border-2 border-zinc-300 p-3 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Product name (e.g. Scissors)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border-2 border-zinc-300 p-3 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            autoComplete="off"
          />
        </div>
        {duplicate && barcode.trim() && (
          <p className="text-sm text-amber-600">This barcode is already in your library.</p>
        )}
        <button
          type="submit"
          disabled={!barcode.trim() || !name.trim() || duplicate}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          Add Product
        </button>
      </form>

      {entries.length > 0 && (
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-zinc-200 p-2.5 text-sm outline-none focus:border-blue-400"
        />
      )}

      <p className="mb-3 text-sm text-zinc-500">
        {entries.length} {entries.length === 1 ? "product" : "products"} in library
      </p>

      {filtered.length === 0 && entries.length > 0 && search && (
        <p className="py-8 text-center text-zinc-400">No products match your search.</p>
      )}

      {entries.length === 0 && (
        <p className="py-12 text-center text-zinc-400">
          No products yet. Add a barcode and name above to get started.
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((entry) => (
          <div
            key={entry.barcode}
            className="flex items-center justify-between rounded-lg bg-white p-3 shadow"
          >
            <div className="min-w-0 flex-1">
              {editingBarcode === entry.barcode ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingBarcode(null);
                  }}
                  autoFocus
                  className="w-full rounded border border-zinc-300 px-2 py-1 font-semibold outline-none focus:border-blue-500"
                />
              ) : (
                <button
                  onClick={() => startEdit(entry)}
                  className="flex items-center gap-2 font-semibold text-zinc-900 hover:text-blue-600"
                  title="Click to rename"
                >
                  <span className="truncate">{entry.name}</span>
                  <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              <p className="mt-0.5 font-mono text-xs text-zinc-500">{entry.barcode}</p>
            </div>
            <button
              onClick={() => onRemove(entry.barcode)}
              className="ml-2 rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
              title="Remove"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
