import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthProvider";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth functions
import app from "../firebase/firebase.config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const { signInWithGoogle, user, signOut } = useContext(AuthContext); // Use the context
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both email and password.",
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      const userName = loggedInUser.displayName || loggedInUser.email.split("@")[0];

      navigate(from, { replace: true });

      Swal.fire({
        icon: "success",
        title: `Welcome, ${userName}!`,
        text: "You have been successfully logged in.",
      });
    } catch (error) {
      const errorMessage = error.message;
      console.error("Login error:", errorMessage);
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: errorMessage,
      });
    }
  };

  const handleRegister = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const userName = user.displayName || user.email.split("@")[0];

      navigate(from, { replace: true });

      Swal.fire({
        icon: "success",
        title: `Welcome, ${userName}!`,
        text: "You have been successfully logged in.",
      });
    } catch (error) {
      const errorMessage = error.message;
      console.error("Login error:", errorMessage);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-xs">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Login to your account</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
              Forgot Password?
            </a>
          </div>

          <hr className="my-5" />

          <div className="flex items-center justify-center">
            <button
              type="button"
              className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleRegister}
            >
              Login with Google
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">&copy;2024 Job Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
