import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./shared/Layout.tsx";
import GlobalStyle from "./shared/styles/GlobalStyle.tsx";
import Home from "./pages/home/Home.tsx";
import Search from "./pages/search/Search.tsx";

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
