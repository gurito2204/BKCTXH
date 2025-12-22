import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ManageOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newOfficerEmail, setNewOfficerEmail] = useState("");

  // Fetch all officers
  const fetchOfficers = () => {
    setIsLoading(true);
    fetch("http://localhost:3000/admin/officers")
      .then((res) => res.json())
      .then((data) => {
        setOfficers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching officers:", error);
        setIsLoading(false);
        Swal.fire("Lỗi", "Không thể tải danh sách cán bộ.", "error");
      });
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  // Handle promotion with robust error handling
  const handlePromote = (e) => {
    e.preventDefault();
    if (!newOfficerEmail) {
      Swal.fire("Chưa nhập!", "Vui lòng nhập email để cấp quyền.", "warning");
      return;
    }

    fetch("http://localhost:3000/admin/promote", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newOfficerEmail }),
    })
      .then(async (res) => {
        const data = await res.json(); // Always try to parse the body for more info
        if (!res.ok) {
          // If response is not OK, throw an error with the message from the server body
          throw new Error(data.message || "Hành động thất bại do lỗi không xác định.");
        }
        // If response is OK, our server sends acknowledged: true
        return data;
      })
      .then(() => {
        Swal.fire("Thành công!", "Tài khoản đã được cấp quyền cán bộ thành công.", "success");
        setNewOfficerEmail("");
        fetchOfficers(); // Refresh the list of officers
      })
      .catch((error) => {
        // This will now catch specific errors like "User not found" from the server
        // as well as network errors.
        Swal.fire("Lỗi", error.message, "error");
      });
  };

  // Handle demotion
  const handleDemote = (email) => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: `Bạn có muốn xóa quyền cán bộ của tài khoản ${email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vâng, xóa quyền!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3000/admin/demote", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || "Hành động thất bại.");
            }
            return data;
          })
          .then((data) => {
            if (data.acknowledged) {
              Swal.fire("Đã xóa quyền!", "Tài khoản đã bị xóa quyền cán bộ.", "success");
              fetchOfficers(); // Refresh the list
            }
          })
          .catch((error) => {
            Swal.fire("Lỗi", error.message, "error");
          });
      }
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
      <h1 className="text-center p-4 text-3xl font-bold">QUẢN LÝ CÁN BỘ</h1>

      {/* Add Officer Form */}
      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Thêm cán bộ mới</h2>
        <form onSubmit={handlePromote} className="flex gap-2">
          <input
            type="email"
            value={newOfficerEmail}
            onChange={(e) => setNewOfficerEmail(e.target.value)}
            placeholder="Nhập email của người dùng để cấp quyền..."
            className="flex-grow p-2 border rounded-md"
          />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
            Thêm
          </button>
        </form>
      </div>

      {/* Officers Table */}
      {isLoading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {officers.length > 0 ? (
                officers.map((officer) => (
                  <tr key={officer._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{officer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{officer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDemote(officer.email)}
                        className="py-1 px-3 border rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        Xóa quyền
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Không có cán bộ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOfficers;
