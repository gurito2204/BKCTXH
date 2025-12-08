
import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logOut, userRole, roleLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Đã đăng xuất',
          timer: 1500,
          showConfirmButton: false
        }).then(() => navigate('/'));
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  const navItems = [
    { path: "/", title: "Tìm hoạt động" },
    // Conditionally add items for officers and admins
    ...(userRole === 'officer' || userRole === 'admin' ? [
      { path: "/my-job", title: "Hoạt động của tôi" },
      { path: "/post-job", title: "Đăng hoạt động" },
    ] : [])
  ];

  const renderNavLinks = (className) => (
    <ul className={className}>
      {navItems.map(({ path, title }) => (
        <li key={path} className="text-base text-primary">
          <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setIsMenuOpen(false)}>
            {title}
          </NavLink>
        </li>
      ))}

      {user && (
         <li className="text-base text-primary">
            <NavLink to={`/profile`} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setIsMenuOpen(false)}>
                Cá Nhân
            </NavLink>
        </li>
      )}

      {userRole === 'admin' && (
        <li>
          <Link to="/admin" className="text-red-500 font-bold border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-all" onClick={() => setIsMenuOpen(false)}>
            Trang Admin
          </Link>
        </li>
      )}
    </ul>
  );

  const renderMobileNavLinks = () => (
    <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
            {navItems.map(({ path, title }) => (
                <li key={path} className="text-base text-white first:text-white py-1">
                <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setIsMenuOpen(false)}>
                    {title}
                </NavLink>
                </li>
            ))}

            {user && (
                <li className="text-base text-white py-1">
                    <NavLink to={`/profile`} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setIsMenuOpen(false)}>Cá Nhân</NavLink>
                </li>
            )}
            {userRole === 'admin' && (
                <li className="text-white py-1"><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Trang Admin</Link></li>
            )}

            {!user ? (
                <li className="text-white py-1"><Link to="/login" onClick={() => setIsMenuOpen(false)}>Đăng nhập</Link></li>
            ) : (
                <li className="text-white py-1"><button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Đăng xuất</button></li>
            )}
        </ul>
    </div>
  );

  return (
    <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl text-black">
          <svg width="29" height="30" viewBox="0 0 29 30" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
            <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
          </svg>
          <span className="font-bold">UIT Volunteer</span>
        </a>

        {/* DESKTOP MENU - Conditionally rendered */}
        {!roleLoading && renderNavLinks("hidden md:flex gap-12")}

        <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Chào, {user.displayName || user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="py-2 px-5 border rounded bg-red-500 text-white hover:bg-red-700 transition-all">
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="py-2 px-5 border rounded hover:bg-gray-100 transition-all">Đăng nhập</Link>
              <Link to="/sign-up" className="py-2 px-5 border rounded bg-blue-600 text-white hover:bg-blue-700 transition-all">Đăng ký</Link>
            </>
          )}
        </div>

        <div className="md:hidden block">
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? <FaXmark className="w-5 h-5 text-primary" /> : <FaBarsStaggered className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU ITEMS */}
      {!roleLoading && renderMobileNavLinks()}

    </header>
  );
};

export default Navbar;
