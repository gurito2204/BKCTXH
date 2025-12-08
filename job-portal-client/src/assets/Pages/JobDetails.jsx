import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageHeader from '../../components/PageHeader';
import { AuthContext } from '../../context/AuthProvider'; // Import AuthContext

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const { user } = useContext(AuthContext); // Get user from context

    const fetchJobDetails = () => {
        fetch(`http://localhost:3000/job/${id}`)
            .then(res => res.json())
            .then(data => setJob(data))
            .catch(error => console.error("Error fetching job details:", error));
    };

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const handleApply = async () => {
        // 1. Ensure user is logged in
        if (!user) {
            Swal.fire('Lỗi!', 'Vui lòng đăng nhập để ứng tuyển.', 'error');
            return;
        }

        // 2. Send application to the correct, new endpoint without CV link
        try {
            const response = await fetch(`http://localhost:3000/apply/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    userName: user.displayName || user.email.split('@')[0]
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire('Thành công!', 'Bạn đã ứng tuyển thành công!', 'success');
                fetchJobDetails(); // Refresh job data to update UI
            } else {
                Swal.fire('Lỗi!', result.message || 'Không thể ứng tuyển.', 'error');
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            Swal.fire('Lỗi!', 'Không thể kết nối đến server. Vui lòng thử lại sau.', 'error');
        }
    };

    if (!job) {
        return <div className="text-center py-10">Đang tải thông tin hoạt động...</div>;
    }

    // Determine button state for rendering
    const hasApplied = user && job.applicants?.some(app => app.email === user.email);
    const isClosed = job.status === 'closed';

    const renderApplyButton = () => {
        if (!user) {
            return <p className='text-yellow-600 font-semibold'>Vui lòng đăng nhập để ứng tuyển.</p>;
        }
        if (isClosed) {
            return <button disabled className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full">Đã đóng</button>;
        }
        if (hasApplied) {
            return <button disabled className="bg-green-500 text-white font-bold py-2 px-6 rounded-full">Đã ứng tuyển</button>;
        }
        return (
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                onClick={handleApply}
            >
                Ứng tuyển ngay
            </button>
        );
    }

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            <PageHeader title={job.jobTitle || "Chi tiết hoạt động"} path={'Chi tiết'} />

            <div className="py-10">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600 mb-2">{job.jobTitle}</h1>
                            <p className='text-gray-600'>
                                <span className="font-bold">Số lượng đã đăng ký:</span> {job.applicants?.length || 0} / {job.maxApplicants}
                            </p>
                        </div>
                        <div className="text-right">
                            {renderApplyButton()}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Thông tin chung</h3>
                            <p className="mb-2"><span className="font-bold">Địa điểm:</span> {job.jobLocation}</p>
                            <p className="mb-2"><span className="font-bold">Ngày hoạt động:</span> {new Date(job.postingDate).toLocaleDateString()}</p>
                            <p><span className="font-bold">Quyền lợi (ngày CTXH):</span> {job.minPrice} - {job.maxPrice} ngày</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Người đăng</h3>
                            <p><span className="font-bold">Email:</span> {job.postedBy}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2">Mô tả chi tiết</h3>
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetails;
