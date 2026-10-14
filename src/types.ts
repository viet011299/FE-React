export type Product = { id: string; sku: string; name: string; unit: string; price: number }

export const products: Product[] = [
  { id: 'p-001', sku: 'KB-001', name: 'Bàn phím cơ', unit: 'cái', price: 1250000 },
  { id: 'p-002', sku: 'MS-003', name: 'Chuột không dây', unit: 'cái', price: 550000 },
  { id: 'p-003', sku: 'MN-027', name: 'Màn hình 27 inch', unit: 'cái', price: 4890000 },
  { id: 'p-004', sku: 'HD-512', name: 'Ổ cứng SSD 512 GB', unit: 'cái', price: 1150000 },
]
