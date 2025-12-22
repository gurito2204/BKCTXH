import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";

const CreateJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Set user email automatically from context
  useEffect(() => {
    if (user?.email) {
      setValue("postedBy", user.email);
    }
  }, [user, setValue]);

  const onSubmit = (data) => {
    data.status = "pending";
    fetch("http://localhost:3000/post-job", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.acknowledged === true) {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Hoạt động đã được đăng và đang chờ duyệt!",
          }).then(() => {
            reset();
            navigate("/my-job"); // Navigate after success
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: result.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi kết nối",
          text: "Không thể kết nối đến server. Vui lòng thử lại.",
        });
      });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Tên hoạt động</label>
              <input
                type="text"
                placeholder="Nhập tên hoạt động"
                {...register("jobTitle", { required: "Tên hoạt động là bắt buộc" })}
                className="create-job-input"
              />
              {errors.jobTitle && <span className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</span>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Địa điểm</label>
              <input
                type="text"
                placeholder="Ex: Hà Nội"
                {...register("jobLocation", { required: "Địa điểm là bắt buộc" })}
                className="create-job-input"
              />
              {errors.jobLocation && <span className="text-red-500 text-sm mt-1">{errors.jobLocation.message}</span>}
            </div>
          </div>

          {/* 2nd Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Quyền lợi ít nhất (ngày)</label>
              <input
                type="number"
                step="0.5"
                placeholder="Ex: 2"
                {...register("minBenefits", {
                  required: "Quyền lợi ít nhất là bắt buộc",
                  min: { value: 0.5, message: "Phải lớn hơn 0" },
                  valueAsNumber: true,
                })}
                className="create-job-input"
              />
              {errors.minBenefits && <span className="text-red-500 text-sm mt-1">{errors.minBenefits.message}</span>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Quyền lợi tối đa (ngày)</label>
              <input
                type="number"
                step="0.5"
                placeholder="Ex: 5"
                {...register("maxBenefits", {
                  required: "Quyền lợi tối đa là bắt buộc",
                  valueAsNumber: true,
                  validate: (value) => value >= (watch("minBenefits") || 0) || "Phải lớn hơn hoặc bằng quyền lợi ít nhất",
                })}
                className="create-job-input"
              />
              {errors.maxBenefits && <span className="text-red-500 text-sm mt-1">{errors.maxBenefits.message}</span>}
            </div>
          </div>

          {/* 3rd Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Số lượng ứng viên tối đa</label>
              <input
                type="number"
                placeholder="Ex: 10"
                {...register("maxApplicants", {
                  required: "Số lượng là bắt buộc",
                  min: { value: 1, message: "Tối thiểu 1 ứng viên" },
                  valueAsNumber: true,
                })}
                className="create-job-input"
              />
              {errors.maxApplicants && <span className="text-red-500 text-sm mt-1">{errors.maxApplicants.message}</span>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Ngày hoạt động</label>
              <input type="date" {...register("postingDate", { required: "Ngày hoạt động là bắt buộc" })} className="create-job-input" />
              {errors.postingDate && <span className="text-red-500 text-sm mt-1">{errors.postingDate.message}</span>}
            </div>
          </div>

          {/* 4th Row - Description */}
          <div className="w-full">
            <label className="block mb-2 text-lg">Mô tả hoạt động</label>
            <textarea
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700"
              rows={6}
              placeholder="Nhập mô tả chi tiết cho hoạt động"
              {...register("description", { required: "Mô tả là bắt buộc" })}
              style={{ resize: "none" }}
            />
            {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>}
          </div>

          {/* This input is hidden and automatically filled */}
          <input type="hidden" {...register("postedBy")} />

          <input type="submit" className="block mt-12 bg-blue text-black font-semibold px-8 py-2 rounded-sm cursor-pointer" />
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
