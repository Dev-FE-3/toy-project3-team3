import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/shared/Layout.tsx";
import GlobalStyle from "@/shared/styles/GlobalStyle.tsx";
import Home from "@/pages/homeAndSearch/Home";
import Guide from "@/pages/guide/Guide.tsx";
import Profile from "@/pages/profile/Profile.tsx";
import ProtectedRoute from "@/shared/component/ProtectedRoute.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup";
import Create from "@/pages/playlist/Create";
import Storage from "@/pages/storage/Storage";
import Play from "@/pages/play/Play";
import Search from "./pages/homeAndSearch/Search";

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
        element: <Storage />,
      },
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/play",
        element: <Play />,
      },
      // { 디테일 페이지 만들면 연결시킴
      //   path: "playlist/:p_id",
      //   element: <Detail />,
      // },
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
