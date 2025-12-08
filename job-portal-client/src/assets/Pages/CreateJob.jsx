import React, { useState } from 'react'
import { useForm } from "react-hook-form"

const CreateJob = () => {
    const {
        register,
        handleSubmit,reset,
        formState: { errors },
      } = useForm()
    
      const onSubmit = (data) => {
        data.status = "pending";
        // console.log(data);
        fetch("http://localhost:3000/post-job", {
          method: "POST",
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((result) => {
          if(result.acknowledged === true){
            alert("Hoạt động đã được đăng và đang chờ duyệt!");
          } else {
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
          }
          reset();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Không thể kết nối đến server. Vui lòng kiểm tra lại đường truyền và thử lại.");
        });
        };

  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
{/* Form */}
<div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

    {/* First Row */}
    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>Tên hoạt động</label>
        <input type="text" placeholder='Nhập tên hoạt động'
        {...register("jobTitle", { required: true })} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>Địa điểm</label>
        <input type="text" placeholder='Ex: Hà Nội'
        {...register("jobLocation", { required: true })} className='create-job-input'/>
        </div>
    </div>

    {/* 2nd Row */}
    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>Quyền lợi ít nhất (ngày)</label>
        <input type="text" placeholder='Ex: 2'
        {...register("minPrice")} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>Quyền lợi tối đa (ngày)</label>
        <input type="text" placeholder='Ex: 5'
        {...register("maxPrice", { required: true })} className='create-job-input'/>
        </div>
    </div>
    
    {/* New Row for Max Applicants */}
    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>Số lượng ứng viên tối đa</label>
            <input 
                type="number" 
                placeholder='Ex: 10'
                {...register("maxApplicants", { required: true, valueAsNumber: true })} 
                className='create-job-input'
            />
             {errors.maxApplicants && <span className="text-red-500">This field is required.</span>}
        </div>
        <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>Ngày hoạt động</label>
            <input type="date" placeholder='dd-mm-yyyy'
            {...register("postingDate")} className='create-job-input'/>
        </div>
    </div>

    {/* Third Row */}

    <div className="w-full">
        <div className="w-full">
            <label className='block mb-2 text-lg'>Email người đăng</label>
            <input type="email" placeholder='Ex: employee@gmail.com'
                    {...register("postedBy", { required: true })} className='create-job-input'/>
        </div>
    </div>

{/* 7th Row */}
<div className="w-full">
<label className='block mb-2 text-lg'>Mô tả hoạt động</label>
<textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700'
rows={6}
defaultValue={""}
placeholder='Nhập mô tả chi tiết cho hoạt động'
{...register("description", { required: true })}
style={{ resize: 'none' }}/>
</div>


      <input type="submit" className='block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer'/>
    </form>
</div>
    </div>
  )
}

export default CreateJob