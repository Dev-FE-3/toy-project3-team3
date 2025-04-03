import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./shared/Layout.tsx";
import Home from "./pages/home/Home.tsx";
import Profile from "./pages/profile/Profile.tsx";

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
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
