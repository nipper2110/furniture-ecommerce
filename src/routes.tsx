import { createBrowserRouter } from "react-router";

import RootLayout from "@/pages/RootLayout";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import ErrorPage from "@/pages/Error";
import BlogRootLayout from "@/pages/blogs/BlogRootLayout";
import BlogPage from "@/pages/blogs/Blog";
import BlogDetailPage from "@/pages/blogs/BlogDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      {
        path: "blogs",
        Component: BlogRootLayout,
        children: [
          { index: true, Component: BlogPage },
          { path: ":postId", Component: BlogDetailPage },
        ],
      },
    ],
  },
]);
