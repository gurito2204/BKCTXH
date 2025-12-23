import React, { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthProvider"; // Corrected import path

const JobDetailsModal = ({ job, onClose }) => {
  const { user } = useContext(AuthContext); // Get user from context

  if (!job) return null;

  const handleApply = async () => {
    // 1. Check if user is logged in
    if (!user) {
      Swal.fire("Lỗi!", "Vui lòng đăng nhập để ứng tuyển.", "error");
      return;
    }

    // 2. Send application to the new endpoint
    try {
      const response = await fetch(`http://localhost:3000/apply/${job._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || user.email.split("@")[0],
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Thành công!", "Bạn đã ứng tuyển thành công!", "success").then(() => {
          onClose(); // Close the modal on successful application
        });
      } else {
        Swal.fire("Lỗi!", result.message || "Không thể ứng tuyển.", "error");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire("Lỗi!", "Không thể kết nối đến server. Vui lòng thử lại sau.", "error");
    }
  };

  // Check if the current user has already applied
  const hasApplied = user && job.applicants?.some((app) => app.email === user.email);
  const isClosed = job.status === "closed";

  const renderApplyButton = () => {
    if (isClosed) {
      return (
        <button disabled className="bg-gray-400 text-black font-bold py-2 px-6 rounded-full">
          Đã đóng
        </button>
      );
    }
    if (hasApplied) {
      return (
        <button disabled className="bg-green-500 text-white font-bold py-2 px-6 rounded-full">
          Đã đăng kí
        </button>
      );
    }
    return (
      <button className="bg-blue-600 hover:bg-blue-700 text-black font-bold py-2 px-6 rounded-full transition duration-300" onClick={handleApply}>
        Đăng kí
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl">
          &times;
        </button>

        <h1 className="text-3xl font-bold text-blue-600 mb-4">{job.jobTitle}</h1>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Thông tin chung</h3>
            <p>
              <span className="font-bold">Địa điểm:</span> {job.jobLocation}
            </p>
            <p>
              <span className="font-bold">Ngày hoạt động:</span> {new Date(job.postingDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-bold">Quyền lợi (ngày CTXH):</span> {job.minBenefits} - {job.maxBenefits} ngày
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Người đăng</h3>
            <p>
              <span className="font-bold">Email:</span> {job.postedBy}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Mô tả chi tiết</h3>
          <p className="text-gray-700 whitespace-pre-line max-h-60 overflow-y-auto">{job.description}</p>
        </div>

        <div className="mt-8 text-right">
          {user ? renderApplyButton() : <p className="text-yellow-600 font-semibold">Vui lòng đăng nhập để ứng tuyển.</p>}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
