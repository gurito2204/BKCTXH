
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import Swal from 'sweetalert2';

const MyJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmedDays, setConfirmedDays] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/myJobs/${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      });
  }, [user]);

  const handleConfirmedDaysChange = (applicantId, value) => {
    setConfirmedDays(prev => ({ ...prev, [applicantId]: value }));
  };

  const handleConfirmApplicant = (jobId, applicantId) => {
    const days = confirmedDays[applicantId];
    if (!days || isNaN(days) || Number(days) <= 0) {
        Swal.fire("Lỗi", "Vui lòng nhập một số ngày hợp lệ.", "error");
        return;
    }

    fetch(`http://localhost:3000/job/${jobId}/applicant/${applicantId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmedDays: Number(days) })
    })
    .then(res => res.json())
    .then(result => {
        if(result.acknowledged) {
            Swal.fire("Thành công", "Đã xác nhận người tham gia!", "success");
            // Refresh job data to show updated status
            const updatedJobs = jobs.map(job => {
                if (job._id === jobId) {
                    return {
                        ...job,
                        applicants: job.applicants.map(app => 
                            app._id === applicantId ? { ...app, status: 'confirmed', confirmedDays: Number(days) } : app
                        )
                    };
                }
                return job;
            });
            setJobs(updatedJobs);
        } else {
            Swal.fire("Lỗi", "Không thể xác nhận. Vui lòng thử lại.", "error");
        }
    })
    .catch(err => {
        console.error(err);
        Swal.fire("Lỗi Server", "Đã có lỗi xảy ra phía server.", "error");
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Bạn chắc chứ?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, xóa nó!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/job/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.acknowledged === true) {
              Swal.fire('Đã xóa!', 'Hoạt động đã được xóa.', 'success');
              setJobs(jobs.filter((job) => job._id !== id));
            } else {
              Swal.fire('Lỗi!', 'Không thể xóa hoạt động.', 'error');
            }
          });
      }
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
      <div className="my-jobs-container">
        <h1 className="text-center p-4 text-3xl font-bold">QUẢN LÝ HOẠT ĐỘNG</h1>
        {isLoading ? (
          <p className="text-center">Đang tải...</p>
        ) : ( 
          jobs.map((job) => (
            <div key={job._id} className="border rounded-lg p-6 mb-8 bg-white shadow-md">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h2 className="text-2xl font-semibold text-blue-600">{job.jobTitle}</h2>
                      <p className="text-gray-600">{job.jobLocation} - {job.applicants?.length || 0} ứng viên</p>
                  </div>
                  <div>
                      <Link to={`/edit-job/${job._id}`} className="py-2 px-4 border rounded-md text-blue-600 hover:bg-blue-100 transition-all">Sửa</Link>
                      <button onClick={() => handleDelete(job._id)} className="py-2 px-4 border rounded-md text-red-600 hover:bg-red-100 transition-all ml-2">Xóa</button>
                  </div>
              </div>
              
              <h3 className="text-xl font-semibold border-t pt-4 mt-4">Danh sách ứng viên</h3>
              {job.applicants && job.applicants.length > 0 ? (
                  <div className="overflow-x-auto mt-2">
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày CTXH</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {job.applicants.map(applicant => (
                                  <tr key={applicant._id}>
                                      <td className="px-6 py-4 whitespace-nowrap">{applicant.email}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          {applicant.status === 'confirmed' ? 
                                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đã xác nhận</span> : 
                                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Đang chờ</span>
                                          }
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {
                                          applicant.status === 'confirmed' ? 
                                          (<span className="font-semibold">{applicant.confirmedDays}</span>) : 
                                          (<input 
                                              type="number" 
                                              className="w-24 border rounded-md p-1"
                                              placeholder="VD: 2"
                                              value={confirmedDays[applicant._id] || ''}
                                              onChange={(e) => handleConfirmedDaysChange(applicant._id, e.target.value)}
                                          />)
                                        }
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          {applicant.status !== 'confirmed' && (
                                              <button 
                                                  onClick={() => handleConfirmApplicant(job._id, applicant._id)} 
                                                  className="py-1 px-3 border rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600">
                                                  Xác nhận
                                              </button>
                                          )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              ) : <p className="text-gray-500 mt-2">Chưa có ai ứng tuyển.</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;
