import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import Feeds from "./pages/feeds/Feeds";
import DefaultMobileLayout from "./layouts/DefaultMobileLayout";

const NotFound = lazy(() => import("./pages/not-found/NotFound"));
const CreatePost = lazy(() => import("./pages/create-post/CreatePost"));
const Profile = lazy(() => import("./pages/profile/profile"));
const EditProfile = lazy(() => import("./pages/profile/edit-profile/EditProfile"));
const Login = lazy(() => import("./pages/login/Login"));

import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultMobileLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Feeds />,
          },
          {
            path: "/create-post",
            element: <CreatePost />,
          },
          {
            path: "/profile",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "/profile/edit-profile",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <EditProfile />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
