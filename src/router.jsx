import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import Feeds from "./pages/feeds/Feeds";
import DefaultMobileLayout from "./layouts/DefaultMobileLayout";

const NotFound = lazy(() => import("./pages/not-found/NotFound"));
const CreatePost = lazy(() => import("./pages/create-post/CreatePost"));
const Profile = lazy(() => import("./pages/profile/profile"));
const EditProfile = lazy(() =>
  import("./pages/profile/edit-profile/EditProfile")
);
const Login = lazy(() => import("./pages/login/Login"));
const CameraCapture = lazy(() =>
  import("./pages/camera-capture/CameraCapture")
);
import ProtectedRoute from "./ProtectedRoute";

import Loader from "./components/ui/Loader";

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
            element: (
              <Suspense fallback={<Loader />}>
                <CreatePost />
              </Suspense>
            ),
          },
          {
            path: "/capture",
            element: (
              <Suspense fallback={<Loader />}>
                <CameraCapture />
              </Suspense>
            ),
          },
          {
            path: "/profile",
            element: (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "/profile/edit-profile",
            element: (
              <Suspense fallback={<Loader />}>
                <EditProfile />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
