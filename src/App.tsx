import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./shared/Layout.tsx";
import GlobalStyle from "./shared/styles/GlobalStyle.tsx";
import Home from "./pages/home/Home.tsx";
import Search from "./pages/search/Search.tsx";
import Guide from "./pages/guide/Guide.tsx";
import Profile from "./pages/profile/Profile.tsx";
import Storage from "./pages/storage/storage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
    ],
  },
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
