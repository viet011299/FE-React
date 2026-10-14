import { z } from 'zod'

const money = z.coerce.number().min(0, 'Không được âm')

export const lineItemSchema = z.object({
  productId: z.string().min(1, 'Chọn một sản phẩm'),
  sku: z.string(),
  name: z.string(),
  unit: z.string(),
  quantity: z.coerce.number().int('Phải là số nguyên').min(1, 'Ít nhất là 1'),
  unitPrice: money.min(1, 'Đơn giá phải lớn hơn 0'),
  discount: money.max(100, 'Tối đa 100%'),
})

export const purchaseOrderSchema = z.object({
  supplier: z.string().trim().min(2, 'Nhập ít nhất 2 ký tự'),
  warehouse: z.string().min(1, 'Chọn kho nhận hàng'),
  orderDate: z.string().min(1, 'Chọn ngày tạo'),
  expectedDate: z.string().min(1, 'Chọn ngày dự kiến'),
  budget: money.min(100000, 'Ngân sách tối thiểu 100.000đ'),
  note: z.string().max(300, 'Tối đa 300 ký tự').optional(),
  items: z.array(lineItemSchema).min(1, 'Thêm ít nhất một sản phẩm'),
}).superRefine((data, ctx) => {
  if (data.expectedDate < data.orderDate) {
    ctx.addIssue({ code: 'custom', path: ['expectedDate'], message: 'Ngày nhận không thể trước ngày tạo' })
  }
  const ids = data.items.map((item) => item.productId)
  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({ code: 'custom', path: ['items'], message: 'Một sản phẩm chỉ được xuất hiện một lần' })
  }
  const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (1 - item.discount / 100), 0)
  if (total > data.budget) {
    ctx.addIssue({ code: 'custom', path: ['budget'], message: 'Tổng đơn đang vượt ngân sách' })
  }
})

export type PurchaseOrder = z.input<typeof purchaseOrderSchema>
export type LineItem = z.input<typeof lineItemSchema>
