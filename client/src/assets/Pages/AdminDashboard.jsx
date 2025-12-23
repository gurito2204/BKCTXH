
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link component
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending jobs
  const fetchPendingJobs = () => {
    setIsLoading(true);
    fetch("http://localhost:3000/admin/all-jobs")
      .then((res) => res.json())
      .then((data) => {
        // Filter only for pending jobs on the client-side for immediate UI consistency
        setJobs(data.filter(job => job.status === 'pending'));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
        Swal.fire("Lỗi", "Không thể tải danh sách hoạt động chờ duyệt.", "error");
      });
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  // Handle job approval
  const handleApprove = (id) => {
    fetch(`http://localhost:3000/admin/approve-job/${id}`, { method: "PATCH" })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          Swal.fire("Thành công!", "Hoạt động đã được duyệt.", "success");
          // Remove the approved job from the list
          setJobs(jobs.filter(job => job._id !== id));
        } else {
          throw new Error("Duyệt hoạt động thất bại.");
        }
      })
      .catch(error => {
          Swal.fire("Lỗi", error.message, "error");
      });
  };

  // Handle job rejection (by deleting it)
  const handleReject = (id) => {
    Swal.fire({
        title: 'Bạn chắc chứ?',
        text: "Bạn có muốn từ chối (xóa) hoạt động này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Vâng, từ chối!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/job/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    Swal.fire("Đã từ chối!", "Hoạt động đã bị xóa.", "success");
                    setJobs(jobs.filter(job => job._id !== id));
                }
            })
            .catch(error => Swal.fire("Lỗi", "Không thể xóa hoạt động.", "error"));
        }
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
      
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BẢNG DUYỆT HOẠT ĐỘNG</h1>
          <Link 
              to="/admin/manage-officers"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
              Quản lý Cán bộ
          </Link>
      </div>

      {isLoading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <h2 className="text-xl font-semibold p-4 bg-gray-50">Hoạt động đang chờ duyệt</h2>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">#</th>
                <th scope="col" className="px-6 py-3">Tên hoạt động</th>
                <th scope="col" className="px-6 py-3">Đơn vị tổ chức</th>
                <th scope="col" className="px-6 py-3">Người đăng</th>
                <th scope="col" className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? jobs.map((job, index) => (
                <tr key={job._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{job.jobTitle}</td>
                  <td className="px-6 py-4">{job.companyName}</td>
                  <td className="px-6 py-4 text-gray-600">{job.postedBy}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(job._id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs">
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(job._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">
                      Từ chối
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-6">Không có hoạt động nào đang chờ duyệt.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
