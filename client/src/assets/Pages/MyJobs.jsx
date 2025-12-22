import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ApplicantsModal from "../../components/ApplicantsModal";

const MyJobs = () => {
  const { user, userRole } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = () => {
    if (user?.email) {
      setIsLoading(true);
      fetch(`http://localhost:3000/myJobs/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setJobs(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
          setIsLoading(false);
          Swal.fire("Lỗi", "Không thể tải danh sách hoạt động.", "error");
        });
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleApplicantConfirmed = () => {
    // Re-fetch all jobs to get the latest data after a confirmation.
    fetchJobs();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đồng ý, xóa nó!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/job/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.acknowledged) {
              Swal.fire("Đã xóa!", "Hoạt động đã được xóa.", "success");
              setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
            } else {
              Swal.fire("Lỗi!", "Không thể xóa hoạt động.", "error");
            }
          })
          .catch(() => Swal.fire("Lỗi!", "Lỗi server, không thể xóa.", "error"));
      }
    });
  };

  if (isLoading && !selectedJob) {
    // Prevent full page loader when modal is open
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (userRole === "officer" || userRole === "admin") {
    return (
      <React.Fragment>
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
          <h1 className="text-center text-3xl font-bold mb-8">Quản lý hoạt động của tôi</h1>
          {jobs.length === 0 ? (
            <div className="text-center">
              <p>Bạn chưa đăng hoạt động nào.</p>
              <Link to="/post-job" className="text-blue-600 hover:underline">
                Đăng ngay!
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left">Tên hoạt động</th>
                    <th className="py-3 px-6 text-left">Trạng thái</th>
                    <th className="py-3 px-6 text-center">Ứng viên</th>
                    <th className="py-3 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} className="border-b">
                      <td className="py-4 px-6 font-medium">{job.jobTitle}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs text-white ${
                            job.status === "approved" ? "bg-green-500" : job.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">{job.applicants ? job.applicants.length : 0}</td>
                      <td className="py-4 px-6 text-center space-x-2">
                        <button onClick={() => handleViewApplicants(job)} className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700">
                          Xem ứng viên
                        </button>
                        <Link to={`/edit-job/${job._id}`} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                          Sửa
                        </Link>
                        <button onClick={() => handleDelete(job._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {selectedJob && <ApplicantsModal job={selectedJob} onClose={handleCloseModal} onApplicantConfirmed={handleApplicantConfirmed} />}
      </React.Fragment>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
      <h1 className="text-center text-3xl font-bold mb-8">Hoạt động đã ứng tuyển</h1>
      <p className="text-center">Chức năng đang được phát triển.</p>
    </div>
  );
};

export default MyJobs;
