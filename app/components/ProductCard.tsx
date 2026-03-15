"use client";

import { useState, useRef, useEffect } from "react";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onRename: (barcode: string, newName: string) => void;
  onDelete: (barcode: string) => void;
}

export function ProductCard({ product, onRename, onDelete }: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [isExpanded, setIsExpanded] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
      editRef.current?.select();
    }
  }, [isEditing]);

  function saveRename() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== product.name) {
      onRename(product.barcode, trimmed);
    } else {
      setEditName(product.name);
    }
    setIsEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      saveRename();
    } else if (e.key === "Escape") {
      setEditName(product.name);
      setIsEditing(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              ref={editRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={saveRename}
              onKeyDown={handleEditKeyDown}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-lg font-semibold outline-none focus:border-blue-500"
            />
          ) : (
            <button
              onClick={() => {
                setEditName(product.name);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 text-lg font-semibold text-zinc-900 hover:text-blue-600"
              title="Click to rename"
            >
              <span className="truncate">{product.name}</span>
              <svg
                className="h-4 w-4 shrink-0 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
          <p className="mt-1 font-mono text-sm text-zinc-500">
            {product.barcode}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-600">
              {product.scans.length}
            </span>
            <p className="text-xs text-zinc-500">
              {product.scans.length === 1 ? "scan" : "scans"}
            </p>
          </div>
          <button
            onClick={() => onDelete(product.barcode)}
            className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        {isExpanded ? "Hide" : "Show"} timestamps
      </button>

      {isExpanded && (
        <ul className="mt-2 space-y-1 border-t border-zinc-100 pt-2">
          {[...product.scans].reverse().map((scan) => (
            <li key={scan.id} className="text-sm text-zinc-500">
              {new Date(scan.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
