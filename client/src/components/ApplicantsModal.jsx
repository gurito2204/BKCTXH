import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ApplicantsModal = ({ job, onClose, onApplicantConfirmed }) => {
  const [applicants, setApplicants] = useState(job.applicants || []);
  const [socialDays, setSocialDays] = useState({});

  useEffect(() => {
    const initialDays = {};
    (job.applicants || []).forEach((app) => {
      if (app.status === "confirmed" && app.confirmedDays) {
        initialDays[app._id] = app.confirmedDays;
      }
    });
    setSocialDays(initialDays);
    setApplicants(job.applicants || []);
  }, [job]);

  const handleDaysChange = (applicantId, days) => {
    setSocialDays((prev) => ({ ...prev, [applicantId]: days }));
  };

  const handleConfirm = (applicantId) => {
    const days = socialDays[applicantId];

    if (days === undefined || days === "") {
      Swal.fire("Thiếu thông tin", "Vui lòng nhập số ngày công tác xã hội.", "warning");
      return;
    }

    const numericDays = parseFloat(days);
    if (isNaN(numericDays) || numericDays < 0) {
      Swal.fire("Không hợp lệ", "Số ngày phải là một số lớn hơn hoặc bằng 0.", "error");
      return;
    }

    fetch(`http://localhost:3000/job/${job._id}`)
      .then((res) => res.json())
      .then((fullJob) => {
        if (!fullJob) {
          Swal.fire("Lỗi", "Không thể lấy thông tin hoạt động để xác thực.", "error");
          return;
        }

        const minBenefits = parseFloat(fullJob.minBenefits);
        const maxBenefits = parseFloat(fullJob.maxBenefits);

        let validationError = false;
        if (!isNaN(minBenefits) && !isNaN(maxBenefits)) {
          if (numericDays < minBenefits || numericDays > maxBenefits) {
            Swal.fire("Số ngày không hợp lệ", `Số ngày CTXH phải nằm trong khoảng từ ${minBenefits} đến ${maxBenefits} ngày.`, "error");
            validationError = true;
          }
        } else if (!isNaN(minBenefits)) {
          if (numericDays < minBenefits) {
            Swal.fire("Số ngày không hợp lệ", `Số ngày phải ít nhất là ${minBenefits} ngày.`, "error");
            validationError = true;
          }
        } else if (!isNaN(maxBenefits)) {
          if (numericDays > maxBenefits) {
            Swal.fire("Số ngày không hợp lệ", `Số ngày không được vượt quá ${maxBenefits} ngày.`, "error");
            validationError = true;
          }
        }

        if (validationError) {
          return;
        }

        fetch(`http://localhost:3000/job/${job._id}/applicant/${applicantId}/confirm`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmedDays: numericDays }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.acknowledged) {
              Swal.fire("Thành công!", "Đã xác nhận ứng viên thành công!", "success");
              const updatedApplicants = applicants.map((app) =>
                app._id === applicantId ? { ...app, status: "confirmed", confirmedDays: numericDays } : app
              );
              setApplicants(updatedApplicants);
              if (onApplicantConfirmed) {
                onApplicantConfirmed();
              }
            }
          })
          .catch((error) => {
            Swal.fire("Lỗi", `Hành động thất bại: ${error.message}`, "error");
          });
      })
      .catch((error) => {
        Swal.fire("Lỗi", `Lỗi khi tải thông tin hoạt động: ${error.message}`, "error");
      });
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Duyệt Ứng viên cho: {job.jobTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">
            &times;
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày CTXH</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <tr key={applicant._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{applicant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{applicant.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={socialDays[applicant._id] || ""}
                        disabled={applicant.status === "confirmed"}
                        onChange={(e) => handleDaysChange(applicant._id, e.target.value)}
                        className="w-28 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nhập số ngày"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {applicant.status === "confirmed" ? (
                        <span className="text-green-600 font-bold px-3 py-1 bg-green-100 rounded-full">
                          Đã xác nhận ({applicant.confirmedDays} ngày)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirm(applicant._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-md transition-all"
                        >
                          Xác nhận
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    Chưa có ứng viên nào cho hoạt động này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;
