import { zodResolver } from '@hookform/resolvers/zod'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ItemModal } from './ItemModal'
import { currency, lineTotal } from './format'
import { purchaseOrderSchema, type LineItem, type PurchaseOrder } from './schemas'

const initialValues: PurchaseOrder = { supplier: '', warehouse: '', orderDate: new Date().toISOString().slice(0, 10), expectedDate: '', budget: 10000000, note: '', items: [] }
const col = createColumnHelper<LineItem>()

export function App() {
  const [modal, setModal] = useState<{ index?: number; item?: LineItem } | null>(null)
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitted } } = useForm<PurchaseOrder>({ resolver: zodResolver(purchaseOrderSchema), defaultValues: initialValues, mode: 'onBlur' })
  const { fields, append, update, remove } = useFieldArray({ control, name: 'items' })
  const items = watch('items')
  const total = items.reduce((sum, item) => sum + lineTotal(Number(item.quantity) || 0, Number(item.unitPrice) || 0, Number(item.discount) || 0), 0)
  const columns = useMemo(() => [
    col.accessor('sku', { header: 'Mã SP' }),
    col.accessor('name', { header: 'Sản phẩm' }),
    col.accessor('unit', { header: 'ĐVT' }),
    col.accessor('quantity', { header: 'SL', cell: ({ getValue }) => getValue() }),
    col.accessor('unitPrice', { header: 'Đơn giá', cell: ({ getValue }) => currency(Number(getValue())) }),
    col.accessor('discount', { header: 'CK', cell: ({ getValue }) => `${getValue()}%` }),
    col.display({ id: 'total', header: 'Thành tiền', cell: ({ row }) => currency(lineTotal(Number(row.original.quantity), Number(row.original.unitPrice), Number(row.original.discount))) }),
    col.display({ id: 'actions', header: '', cell: ({ row }) => <div className="row-actions"><button type="button" onClick={() => setModal({ index: row.index, item: row.original })}>Sửa</button><button type="button" className="danger-link" onClick={() => remove(row.index)}>Xóa</button></div> }),
  ], [remove])
  const table = useReactTable({ data: fields, columns, getCoreRowModel: getCoreRowModel() })

  function saveItem(item: LineItem) {
    if (modal?.index === undefined) append(item)
    else update(modal.index, item)
    setModal(null)
  }

  function submit(data: PurchaseOrder) { window.alert(`Đơn mua hàng hợp lệ. Tổng giá trị: ${currency(total)}\n${JSON.stringify(data, null, 2)}`) }

  return <main className="page"><header><p className="eyebrow">REACT FORM LAB · BÀI 01</p><h1>Tạo đơn mua hàng</h1><p className="subtle">React Hook Form + Zod + TanStack Table + modal nhập liệu.</p></header>
    <form onSubmit={handleSubmit(submit)} noValidate>
      <section className="card"><div className="section-title"><div><h2>Thông tin chung</h2><p>Trường có dấu * là bắt buộc.</p></div></div>
        <div className="form-grid">
          <label>Nhà cung cấp *<input placeholder="Ví dụ: Công ty ABC" {...register('supplier')} /><small>{errors.supplier?.message}</small></label>
          <label>Kho nhận hàng *<select {...register('warehouse')}><option value="">-- Chọn kho --</option><option value="hn">Kho Hà Nội</option><option value="hcm">Kho Hồ Chí Minh</option><option value="dn">Kho Đà Nẵng</option></select><small>{errors.warehouse?.message}</small></label>
          <label>Ngày tạo *<input type="date" {...register('orderDate')} /><small>{errors.orderDate?.message}</small></label>
          <label>Ngày nhận dự kiến *<input type="date" {...register('expectedDate')} /><small>{errors.expectedDate?.message}</small></label>
          <label>Ngân sách (VNĐ) *<input type="number" min="0" {...register('budget')} /><small>{errors.budget?.message}</small></label>
          <label>Ghi chú<textarea placeholder="Điều khoản giao hàng, lưu ý..." {...register('note')} /><small>{errors.note?.message}</small></label>
        </div>
      </section>
      <section className="card table-card"><div className="section-title"><div><h2>Danh sách sản phẩm</h2><p>Thêm hoặc cập nhật dòng hàng trong modal.</p></div><button type="button" onClick={() => setModal({})}>+ Thêm sản phẩm</button></div>
        {errors.items?.message && <p className="form-error">{errors.items.message}</p>}
        <div className="table-wrap"><table><thead>{table.getHeaderGroups().map(g => <tr key={g.id}>{g.headers.map(h => <th key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.length ? table.getRowModel().rows.map(row => <tr key={row.id}>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={8} className="empty">Chưa có sản phẩm. Hãy thêm dòng hàng đầu tiên.</td></tr>}</tbody></table></div>
        <div className="summary"><span>Tạm tính</span><strong>{currency(total)}</strong></div>
      </section>
      {isSubmitted && errors.budget?.message && <p className="form-error budget-error">{errors.budget.message}</p>}
      <div className="footer-actions"><span>Tổng {items.length} dòng hàng</span><button type="submit">Tạo đơn mua hàng</button></div>
    </form>
    {modal && <ItemModal initialValue={modal.item} onClose={() => setModal(null)} onSave={saveItem} />}
  </main>
}
