import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/shared/Layout.tsx";
import GlobalStyle from "@/shared/styles/GlobalStyle.tsx";
import Home from "@/pages/home/Home.tsx";
import Search from "@/pages/search/Search.tsx";
import Guide from "@/pages/guide/Guide.tsx";
import Profile from "@/pages/profile/Profile.tsx";
import ProtectedRoute from "@/shared/component/ProtectedRoute.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup";
import Create from "@/pages/playlist/Create";
import Storage from "@/pages/storage/Storage";
import NavigateToMyStorage from "@/pages/storage/NavigateToMyStorage";
import FollowInfo from "@/pages/followInfo/FollowInfo";

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
        path: "guide",
        element: <Guide />,
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
