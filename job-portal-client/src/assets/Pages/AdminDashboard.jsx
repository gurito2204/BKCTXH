import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API lấy tất cả bài đăng khi vào trang
  useEffect(() => {
    setIsLoading(true);
    // Lưu ý: Đảm bảo Backend chạy ở cổng 3000 (hoặc sửa lại port đúng của bạn)
    fetch("http://localhost:3000/all-jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      });
  }, []);

  // Hàm xử lý Duyệt hoặc Từ chối
  const handleUpdateStatus = (id, newStatus) => {
    fetch(`http://localhost:3000/update-job/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: newStatus }), // Gửi trạng thái mới về server
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          alert(`Đã cập nhật trạng thái: ${newStatus === "approved" ? "Đã duyệt" : "Từ chối"}`);
          // Cập nhật lại giao diện ngay lập tức mà không cần load lại trang
          const updatedJobs = jobs.map((job) => (job._id === id ? { ...job, status: newStatus } : job));
          setJobs(updatedJobs);
        }
      });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10">
        <h1 className="text-2xl font-bold text-center mb-8">BẢNG XÉT DUYỆT HOẠT ĐỘNG (ADMIN)</h1>

        {isLoading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              {/* Header của bảng */}
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tên Hoạt Động
                  </th>
                  <th scope="col" className="px-6 py-3">
                    CLB Đăng Cai
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ngày CTXH
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Trạng Thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Hành Động
                  </th>
                </tr>
              </thead>

              {/* Body của bảng */}
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={job._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>

                    <td className="px-6 py-4 font-bold text-blue-600">{job.jobTitle}</td>

                    <td className="px-6 py-4">{job.companyName}</td>

                    {/* Hiển thị lương dưới dạng Ngày CTXH (Lấy minPrice làm ví dụ) */}
                    <td className="px-6 py-4 font-bold text-green-600">{job.minPrice} Ngày</td>

                    {/* Cột trạng thái */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs 
                        ${job.status === "approved" ? "bg-green-500" : job.status === "rejected" ? "bg-red-500" : "bg-yellow-500"}`}
                      >
                        {job.status || "Chờ duyệt"}
                      </span>
                    </td>

                    {/* Các nút bấm */}
                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                      {/* Nút Duyệt */}
                      <button
                        onClick={() => handleUpdateStatus(job._id, "approved")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Duyệt
                      </button>

                      {/* Nút Từ chối */}
                      <button
                        onClick={() => handleUpdateStatus(job._id, "rejected")}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
