# Lộ trình bài tập — Form đơn mua hàng

Chạy dự án bằng `npm install` rồi `npm run dev`.

## Bài 1 — Đọc và chạy khung

- Thử submit khi chưa điền dữ liệu và quan sát lỗi Zod.
- Thêm, sửa, xoá một sản phẩm bằng modal.
- Xem các rule trong `src/schemas.ts`: ngày nhận, trùng sản phẩm, và tổng vượt ngân sách.

## Bài 2 — Inline edit trong TanStack Table

Thay cột `quantity`, `unitPrice`, `discount` thành input ngay trong bảng. Dùng `register(\`items.${row.index}.quantity\`)` và gọi `trigger('items')` sau khi đổi giá trị.

Mục tiêu: tổng tiền cập nhật ngay, lỗi của từng ô hiển thị dưới input.

## Bài 3 — Validation nâng cao

- Không cho ngày dự kiến quá 90 ngày kể từ ngày tạo.
- Nếu tổng đơn trên 20 triệu, `note` phải có ít nhất 20 ký tự.
- Tạo mã đơn tự động theo dạng `PO-YYYYMMDD-XXX`; validate đúng định dạng với Zod.

## Bài 4 — Async validation

Tạo hàm giả `checkSupplierCode` trả Promise. Thêm trường mã nhà cung cấp, debounce 400ms, hiện trạng thái “đang kiểm tra”, và báo lỗi nếu mã đã tồn tại.

## Bài 5 — Draft và trải nghiệm người dùng

- Lưu dữ liệu form vào `localStorage` bằng `watch`.
- Khi tải lại trang, hỏi người dùng có muốn khôi phục bản nháp không.
- Thêm hộp xác nhận trước khi xoá dòng hàng hoặc rời trang khi form đang dirty.

## Bài 6 — Tách module

Tách `App.tsx` thành `PurchaseOrderForm`, `OrderItemsTable`, `OrderSummary`, và hook `usePurchaseOrder`. Mục tiêu: không component nào dài quá khoảng 150 dòng.
