import React, { useEffect, useState } from 'react';

const ApplicantsModal = ({ job, onClose }) => {
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [socialDays, setSocialDays] = useState({});

    useEffect(() => {
        if (job?._id) {
            setIsLoading(true);
            fetch(`http://localhost:3000/job/${job._id}/applicants`)
                .then(res => res.json())
                .then(data => {
                    setApplicants(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [job]);

    const handleDaysChange = (email, days) => {
        setSocialDays(prev => ({ ...prev, [email]: days }));
    };

    const handleConfirm = (applicantEmail) => {
        const days = socialDays[applicantEmail];
        if (!days || days < job.minPrice || days > job.maxPrice || days % 0.5 !== 0) {
            alert(`Invalid social days. Must be between ${job.minPrice} and ${job.maxPrice}, and a multiple of 0.5.`);
            return;
        }

        fetch(`http://localhost:3000/job/${job._id}/confirm-days`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicantEmail, socialDays: parseFloat(days) })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert('Social days confirmed!');
                // Refresh applicants to show confirmed status
                const updatedApplicants = applicants.map(app => 
                    app.email === applicantEmail ? { ...app, socialDays: days, confirmed: true } : app
                );
                setApplicants(updatedApplicants);
            } else {
                alert('Failed to confirm.');
            }
        });
    };

    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Applicants for {job.jobTitle}</h2>
                {isLoading ? <p>Loading...</p> :
                    <div className="overflow-auto max-h-[70vh]">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social Days</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applicants.map(applicant => (
                                    <tr key={applicant.email}>
                                        <td className="px-6 py-4 whitespace-nowrap">{applicant.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{applicant.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input 
                                                type="number"
                                                min={job.minPrice}
                                                max={job.maxPrice}
                                                step="0.5"
                                                defaultValue={applicant.socialDays > 0 ? applicant.socialDays : ''}
                                                disabled={applicant.confirmed}
                                                onChange={(e) => handleDaysChange(applicant.email, e.target.value)}
                                                className="w-24 border-gray-300 rounded-md shadow-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {applicant.confirmed ? 
                                                <span className='text-green-600 font-bold'>Confirmed</span> :
                                                <button 
                                                    onClick={() => handleConfirm(applicant.email)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Confirm
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                <button onClick={onClose} className="mt-6 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default ApplicantsModal;
