# [SE113.Q21 - Frontend]

Frontend admin dashboard cho hệ thống quản lý bảo trì và sửa chữa thiết bị.

Ứng dụng sử dụng React, Vite, Ant Design và Tailwind CSS để xây dựng giao diện admin với xác thực JWT, điều hướng theo vai trò và kết nối API backend.

## Tính năng chính

- Đăng nhập admin/technician qua `/admin/login`
- Dashboard tổng quan với thống kê thiết bị, kế hoạch bảo trì, yêu cầu sửa chữa và lịch sử công việc
- Quản lý người dùng: thêm, sửa, xóa, tìm kiếm và lọc
- Quản lý thiết bị, kế hoạch bảo trì và yêu cầu sửa chữa (các trang đã có cấu trúc và route)
- Hệ thống route bảo mật theo vai trò:
  - `admin`: truy cập toàn bộ dashboard, quản lý user, device, maintenance, repair
  - `technician`: truy cập dashboard và các chức năng kỹ thuật viên
- Tự động refresh access token khi token hết hạn bằng refresh token

## Kiến trúc dự án

- `src/main.jsx`: khởi tạo React app, đăng ký các context provider
- `src/App.jsx`: cấu hình router và kiểm soát route private/public
- `src/routes/route.jsx`: định nghĩa route admin, dashboard, quản lý người dùng, thiết bị, bảo trì, sửa chữa
- `src/context/`: chứa các Context quản lý trạng thái và gọi API
  - `AuthContext.jsx`
  - `UserContext.jsx`
  - `DeviceContext.jsx`
  - `MaintenancePlanContext.jsx`
  - `RepairPlanContext.jsx`
  - `WorkHistoryContext.jsx`
- `src/services/api/`: file Axios instance và module API cho backend
  - `AxiosInstance.js`
  - `AuthApi.js`
  - `UserApi.js`
  - `DeviceApi.js`
  - `MaintenancePlanApi.js`
  - `RepairPlanApi.js`
  - `WorkHistoryApi.js`
- `src/admin/pages/`: các trang admin
- `src/admin/layout/`: layout admin bao gồm sidebar và topbar
- `src/components/`: các component UI dùng chung

## Yêu cầu backend

Frontend này mặc định kết nối đến backend tại:

- `http://localhost:5000`

## Công nghệ sử dụng

- React 19
- Vite
- Ant Design
- Tailwind CSS
- React Router DOM

## Cài đặt

```bash
cd KCPM_FE
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt tại địa chỉ được hiển thị bởi Vite.

## Cấu hình tùy chỉnh

Nếu backend không chạy trên `http://localhost:5000`, chỉnh `baseURL` trong `src/services/api/AxiosInstance.js`.
