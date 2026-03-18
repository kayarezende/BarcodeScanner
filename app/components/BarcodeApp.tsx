"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, ScanEvent, ProductEntry } from "../types";
import { ScannerInput } from "./ScannerInput";
import { ProductList } from "./ProductList";
import { ProductLibrary } from "./ProductLibrary";

const STORAGE_KEY = "barcode-scanner-data";
const LIBRARY_KEY = "barcode-product-library";

type Tab = "scanner" | "library";

export function BarcodeApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [library, setLibrary] = useState<ProductEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("scanner");

  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        // corrupted data — start fresh
      }
    }
    const savedLibrary = localStorage.getItem(LIBRARY_KEY);
    if (savedLibrary) {
      try {
        setLibrary(JSON.parse(savedLibrary));
      } catch {
        // corrupted data — start fresh
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    }
  }, [library, isLoaded]);

  const handleScan = useCallback((barcode: string) => {
    const newScan: ScanEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setProducts((prev) => {
      const existing = prev.find((p) => p.barcode === barcode);
      if (existing) {
        return prev.map((p) =>
          p.barcode === barcode
            ? { ...p, scans: [...p.scans, newScan] }
            : p
        );
      }
      // Look up name from product library
      const libraryEntry = library.find((e) => e.barcode === barcode);
      const name = libraryEntry ? libraryEntry.name : barcode;
      return [{ barcode, name, scans: [newScan] }, ...prev];
    });
  }, [library]);

  const handleDelete = useCallback((barcode: string) => {
    setProducts((prev) => prev.filter((p) => p.barcode !== barcode));
  }, []);

  const handleRename = useCallback((barcode: string, newName: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.barcode === barcode ? { ...p, name: newName } : p))
    );
  }, []);

  const handleAddEntry = useCallback((entry: ProductEntry) => {
    setLibrary((prev) => [entry, ...prev]);
  }, []);

  const handleRemoveEntry = useCallback((barcode: string) => {
    setLibrary((prev) => prev.filter((e) => e.barcode !== barcode));
  }, []);

  const handleUpdateEntry = useCallback((barcode: string, name: string) => {
    setLibrary((prev) =>
      prev.map((e) => (e.barcode === barcode ? { ...e, name } : e))
    );
  }, []);

  const totalScans = products.reduce((sum, p) => sum + p.scans.length, 0);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">
        Barcode Scanner
      </h1>

      <div className="mb-6 flex rounded-lg bg-zinc-200 p-1">
        <button
          onClick={() => setTab("scanner")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "scanner"
              ? "bg-white text-zinc-900 shadow"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Scan &amp; Pack
        </button>
        <button
          onClick={() => setTab("library")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "library"
              ? "bg-white text-zinc-900 shadow"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Product Library
          {library.length > 0 && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {library.length}
            </span>
          )}
        </button>
      </div>

      {tab === "scanner" ? (
        <>
          <ScannerInput onScan={handleScan} />

          <p className="my-4 text-sm text-zinc-500">
            {totalScans} {totalScans === 1 ? "scan" : "scans"} across{" "}
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>

          <ProductList products={products} onRename={handleRename} onDelete={handleDelete} />
        </>
      ) : (
        <ProductLibrary
          entries={library}
          onAdd={handleAddEntry}
          onRemove={handleRemoveEntry}
          onUpdate={handleUpdateEntry}
        />
      )}
    </div>
  );
}
