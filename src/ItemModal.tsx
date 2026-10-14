import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { lineItemSchema, type LineItem } from './schemas'
import { products } from './types'

type Props = { initialValue?: LineItem; onClose: () => void; onSave: (item: LineItem) => void }

export function ItemModal({ initialValue, onClose, onSave }: Props) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<LineItem>({
    resolver: zodResolver(lineItemSchema),
    defaultValues: initialValue ?? { productId: '', sku: '', name: '', unit: '', quantity: 1, unitPrice: 0, discount: 0 },
  })

  useEffect(() => { reset(initialValue ?? { productId: '', sku: '', name: '', unit: '', quantity: 1, unitPrice: 0, discount: 0 }) }, [initialValue, reset])

  return <div className="backdrop" role="presentation" onMouseDown={onClose}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-head"><div><p className="eyebrow">DÒNG HÀNG</p><h2 id="item-modal-title">{initialValue ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</h2></div><button className="icon-btn" type="button" onClick={onClose}>×</button></div>
      <form onSubmit={handleSubmit(onSave)} className="modal-form">
        <label>Sản phẩm
          <select {...register('productId')} onChange={(event) => {
            const product = products.find((p) => p.id === event.target.value)
            setValue('productId', event.target.value, { shouldValidate: true })
            if (product) {
              setValue('sku', product.sku); setValue('name', product.name); setValue('unit', product.unit)
              setValue('unitPrice', product.price, { shouldValidate: true })
            }
          }}>
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((product) => <option value={product.id} key={product.id}>{product.sku} — {product.name}</option>)}
          </select>
          <small>{errors.productId?.message}</small>
        </label>
        <div className="two-col">
          <label>Số lượng<input type="number" min="1" {...register('quantity')} /><small>{errors.quantity?.message}</small></label>
          <label>Đơn giá<input type="number" min="0" {...register('unitPrice')} /><small>{errors.unitPrice?.message}</small></label>
        </div>
        <label>Chiết khấu (%)<input type="number" min="0" max="100" {...register('discount')} /><small>{errors.discount?.message}</small></label>
        <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Hủy</button><button type="submit">Lưu dòng hàng</button></div>
      </form>
    </section>
  </div>
}
