import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthProvider'; // Import the AuthContext

const Login = () => {
  const { signInWithGoogle, user, signOut } = useContext(AuthContext); // Use the context
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const userName = user.displayName || user.email.split('@')[0];

      navigate('/', { replace: true });

      Swal.fire({
        icon: 'success',
        title: `Welcome, ${userName}!`,
        text: 'You have been successfully logged in.',
      });
    } catch (error) {
      const errorMessage = error.message;
      console.error('Login error:', errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });

      Swal.fire({
        icon: 'info',
        title: 'Logout Successful',
        text: 'You have been logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className='h-screen w-full flex items-center justify-center'>
      {user ? (
        <div className="flex flex-col items-center">
          <p className="text-3xl font-bold mb-4 text-center">Logged in as: {user.displayName || user.email.split('@')[0]}</p>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleLogin}>
          Login with Google
        </button>
      )}
    </div>
  );
};

export default Login;
