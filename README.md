# BKCTXH - Nền tảng Quản lý Việc làm & Công tác xã hội

Một ứng dụng Full-stack (MERN Stack) được thiết kế để kết nối người dùng với các cơ hội việc làm, công tác xã hội, đồng thời cung cấp hệ thống quản lý cho Admin và Cán bộ (Officers).

## 🚀 Tính năng nổi bật

* **Xác thực người dùng:** Đăng nhập, Đăng ký an toàn (Tích hợp Firebase).
* **Quản lý Việc làm (Jobs):**
  * Tạo mới, cập nhật, chỉnh sửa và xóa việc làm (CRUD).
  * Xem chi tiết công việc (`JobDetails`).
  * Quản lý danh sách công việc đã đăng (`MyJobs`).
* **Trang tìm kiếm & Lọc:** Tìm kiếm công việc theo danh mục, vị trí, mức lương (Sidebar filters).
* **Quản lý Hồ sơ & Ứng viên:** * Người dùng có thể cập nhật thông tin cá nhân (`Profile`).
  * Nhà tuyển dụng xem danh sách ứng viên (`ApplicantsModal`).
* **Hệ thống Quản trị (Admin Dashboard):** Bảng điều khiển dành riêng cho quản trị viên, quản lý hệ thống cán bộ (`ManageOfficers`) và theo dõi lương (`SalaryPage`).

## 🛠️ Công nghệ sử dụng

**Frontend (`/client`):**
* [React.js](https://reactjs.org/) - Thư viện giao diện người dùng.
* [Vite](https://vitejs.dev/) - Công cụ build frontend siêu tốc.
* [Tailwind CSS](https://tailwindcss.com/) - Framework CSS tiện lợi.
* [React Router DOM](https://reactrouter.com/) - Quản lý điều hướng trang.
* [Firebase](https://firebase.google.com/) - Dùng để xác thực (Auth).

**Backend (`/server`):**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Xây dựng RESTful API.
* [MongoDB](https://www.mongodb.com/) - Cơ sở dữ liệu NoSQL.
* [Cors](https://www.npmjs.com/package/cors) & [Dotenv](https://www.npmjs.com/package/dotenv) - Quản lý middleware và biến môi trường.



## ⚙️ Hướng dẫn Cài đặt & Chạy dự án (Local)

### Yêu cầu hệ thống:
* [Node.js](https://nodejs.org/en/download/) (Khuyến nghị bản LTS)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local hoặc MongoDB Atlas)

### Bước 1: Clone dự án
```bash
git clone [https://github.com/gurito2204/bkctxh.git](https://github.com/gurito2204/bkctxh.git)
cd bkctxh
```
### Bước 2: Cài đặt và Chạy Backend (Server)
Mở một terminal mới và di chuyển vào thư mục server:

```bash
cd server
```
Cài đặt các gói phụ thuộc:

```bash
npm install
```
Tạo một file .env trong thư mục server và thêm các biến môi trường:
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```
Khởi động server (sử dụng nodemon):

```bash
npm run dev
(Server sẽ chạy tại http://localhost:5000)
```
###  Bước 3: Cài đặt và Chạy Frontend (Client)
Mở một terminal khác và di chuyển vào thư mục client:

```bash
cd client
```
Cài đặt các gói phụ thuộc:

```bash
npm install
```
Cấu hình Firebase: Đảm bảo bạn đã điền đúng thông tin cấu hình Firebase trong thư mục client/src/firebase/firebase.config.js hoặc cấu hình qua .env.

Khởi động client:
```bash
npm run dev
```
(Giao diện sẽ chạy tại http://localhost:5173)
