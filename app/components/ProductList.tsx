import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onRename: (barcode: string, newName: string) => void;
  onDelete: (barcode: string) => void;
}

export function ProductList({ products, onRename, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-400">
        No products scanned yet. Scan a barcode to get started.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductCard
          key={product.barcode}
          product={product}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
