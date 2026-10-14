export const currency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

export const lineTotal = (quantity: number, unitPrice: number, discount: number) => quantity * unitPrice * (1 - discount / 100)
