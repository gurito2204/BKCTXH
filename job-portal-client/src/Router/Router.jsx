
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../assets/Pages/Home";
import About from "../assets/Pages/About";
import CreateJob from "../assets/Pages/CreateJob";
import MyJobs from "../assets/Pages/MyJobs";
import UpdateJob from "../assets/Pages/UpdateJob";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminDashboard from "../assets/Pages/AdminDashboard";
import Profile from "../assets/Pages/Profile";
import ManageOfficers from "../assets/Pages/ManageOfficers";
import PrivateRoute from "./PrivateRoute.jsx"; // FIX: Explicitly add the .jsx extension

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/post-job",
        element: <CreateJob />,
      },
      {
        path: "/my-job",
        element: <MyJobs />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/edit-job/:id",
        element: <UpdateJob />,
        loader: ({ params }) => fetch(`http://localhost:3000/job/${params.id}`),
      },
      {
        path: "/admin",
        // Protect the Admin Dashboard route
        element: <PrivateRoute><AdminDashboard /></PrivateRoute>,
      },
      {
        path: "/admin/manage-officers",
        // Protect the Manage Officers route
        element: <PrivateRoute><ManageOfficers /></PrivateRoute>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
]);

export default router;
