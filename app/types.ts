export interface ScanEvent {
  id: string;
  timestamp: string;
}

export interface Product {
  barcode: string;
  name: string;
  scans: ScanEvent[];
}

export interface ProductEntry {
  barcode: string;
  name: string;
}
