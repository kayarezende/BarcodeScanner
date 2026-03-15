"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, ScanEvent } from "../types";
import { ScannerInput } from "./ScannerInput";
import { ProductList } from "./ProductList";

const STORAGE_KEY = "barcode-scanner-data";

export function BarcodeApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
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
      return [{ barcode, name: barcode, scans: [newScan] }, ...prev];
    });
  }, []);

  const handleDelete = useCallback((barcode: string) => {
    setProducts((prev) => prev.filter((p) => p.barcode !== barcode));
  }, []);

  const handleRename = useCallback((barcode: string, newName: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.barcode === barcode ? { ...p, name: newName } : p))
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

      <ScannerInput onScan={handleScan} />

      <p className="my-4 text-sm text-zinc-500">
        {totalScans} {totalScans === 1 ? "scan" : "scans"} across{" "}
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      <ProductList products={products} onRename={handleRename} onDelete={handleDelete} />
    </div>
  );
}
