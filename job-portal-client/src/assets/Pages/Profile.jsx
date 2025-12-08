
import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider'; // CORRECTED IMPORT PATH

const Profile = () => {
    const [participatedJobs, setParticipatedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext); // Get user from context

    useEffect(() => {
        // Only fetch if the user is logged in
        if (user?.email) {
            setIsLoading(true);
            fetch(`http://localhost:3000/all-jobs`) // Fetch all jobs
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(allJobs => {
                    // Filter for jobs where the user's application is 'confirmed'
                    const userParticipations = allJobs.filter(job =>
                        job.applicants?.some(applicant =>
                            applicant.email === user.email && applicant.status === 'confirmed'
                        )
                    );
                    setParticipatedJobs(userParticipations);
                    setIsLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false); // If no user, stop loading
        }
    }, [user]); // Rerun when user object changes

    // Calculate total confirmed social work days from the filtered list
    const totalDays = participatedJobs.reduce((acc, job) => {
        // Find the specific applicant entry for the current user
        const userApplicant = job.applicants.find(app => app.email === user.email);
        // Sum up the 'confirmedDays' from that applicant object
        const days = userApplicant && userApplicant.confirmedDays ? Number(userApplicant.confirmedDays) : 0;
        return acc + days;
    }, 0);

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Hoạt động đã tham gia</h1>

            {isLoading && <p className="text-center">Đang tải dữ liệu...</p>}
            {error && <p className="text-center text-red-500">Lỗi: {error}</p>}
            {!user && !isLoading && <p className="text-center">Vui lòng <NavLink to="/login" className="text-blue-500">đăng nhập</NavLink> để xem hoạt động của bạn.</p>}

            {user && !isLoading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên hoạt động
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Địa điểm
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày CTXH (Đã xác nhận)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {participatedJobs.length > 0 ? (
                                participatedJobs.map(job => {
                                    // Find the applicant details again to display confirmed days for this specific job
                                    const userApplicant = job.applicants.find(app => app.email === user.email);
                                    const confirmedDays = userApplicant ? userApplicant.confirmedDays : 'N/A';

                                    return (
                                        <tr key={job._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{job.jobLocation}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {confirmedDays}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Bạn chưa có hoạt động nào được xác nhận.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-100">
                            <tr>
                                <td colSpan="2" className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                                    TỔNG SỐ NGÀY ĐÃ XÁC NHẬN
                                </td>
                                <td className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                                    {totalDays} ngày
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
             <div className="text-center mt-6">
                <NavLink to="/" className="text-blue-500 hover:underline">
                    &larr; Quay lại trang chủ
                </NavLink>
            </div>
        </div>
    );
};

export default Profile;
