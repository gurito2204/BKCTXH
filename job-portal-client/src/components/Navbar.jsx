// --- FILE: job-portal-client/src/components/Navbar.jsx ---
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase/firebase.config";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Biến lưu thông tin người dùng

  const auth = getAuth(app);
  const adminEmail = "nofapplz04@gmail.com"; // Email Admin

  // Lắng nghe sự kiện đăng nhập/đăng xuất
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        alert("Đã đăng xuất!");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const navItems = [
    { path: "/", title: "Start a Search" },
    { path: "/my-job", title: "My Jobs" },
    { path: "/salary", title: "Salary Estimate" },
    { path: "/post-job", title: "Post a Job" },
  ];

  return (
    <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl text-black">
          <svg className="" width="29" height="30" viewBox="0 0 29 30" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
            <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
          </svg>
          <span className="font-bold">JobJunction</span>
        </a>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-12">
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-primary">
              <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                {title}
              </NavLink>
            </li>
          ))}

          {/* Nút Admin chỉ hiện khi đúng email */}
          {user?.email === adminEmail && (
            <li>
              <Link to="/admin" className="text-red-500 font-bold border border-red-500 px-3 py-1 rounded">
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* NÚT LOGIN / LOGOUT */}
        <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Chào, {user.displayName || user.email}</span>
              <button onClick={handleLogout} className="py-2 px-5 border rounded bg-red-500 text-white hover:bg-red-700 transition-all">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="py-2 px-5 border rounded">
                Login
              </Link>
              <Link to="/sign-up" className="py-2 px-5 border rounded bg-blue text-white">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden block">
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? <FaXmark className="w-5 h-5 text-primary" /> : <FaBarsStaggered className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU ITEMS */}
      <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul className="">
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-white first:text-white py-1">
              <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                {title}
              </NavLink>
            </li>
          ))}

          {/* Link Admin Mobile */}
          {user?.email === adminEmail && (
            <li className="text-white py-1">
              <Link to="/admin">Admin Panel</Link>
            </li>
          )}

          {!user ? (
            <li className="text-white py-1">
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li className="text-white py-1">
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
