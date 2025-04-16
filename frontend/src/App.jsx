import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FindPeople from "../component/FindPeople";
import Friends from "../component/Friends";
import Profile from "../component/Profile";
import FriendRequest from "../component/FriendRequest";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import Message from "../pages/Message.jsx";

RouterProvider;


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/",
          element: <Friends />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/friend-req",
          element: <FriendRequest />,
        },
        {
          path: "/people",
          element: <FindPeople />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
