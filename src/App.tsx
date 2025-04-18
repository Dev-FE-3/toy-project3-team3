import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/shared/Layout.tsx";
import GlobalStyle from "@/shared/styles/GlobalStyle.tsx";
import Home from "@/pages/homeAndSearch/Home";
import Profile from "@/pages/profile/Profile.tsx";
import ProtectedRoute from "@/shared/component/ProtectedRoute.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup";
import Create from "@/pages/playlist/Create";
import Storage from "@/pages/storage/Storage";
import NavigateToMyStorage from "@/pages/storage/hooks/NavigateToMyStorage";
import FollowInfo from "@/pages/followInfo/FollowInfo";
import Play from "@/pages/play/Play";
import Search from "@/pages/homeAndSearch/Search";
import Modify from "@/pages/playlist/Modify";
import Detail from "@/pages/playlist/detail/Detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/storage",
        element: <NavigateToMyStorage />, // 내부에서 useUser()로 randomId 가져와서 redirect
      },
      {
        path: "/storage/:randomId",
        element: <Storage />, // 내 계정도 randomId로 접근하게 함
      },
      {
        path: "/storage/:randomId/follow-info",
        element: <FollowInfo />, // follow/following 전용 페이지
      },
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/edit/:playlistId",
        element: <Modify />,
      },
      {
        path: "/play/:p_id/:video_id",
        element: <Play />,
      },
      {
        path: "playlist/:p_id",
        element: <Detail />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
