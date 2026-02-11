import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import RootLayout from "@/pages/RootLayout";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import ErrorPage from "@/pages/Error";
// import BlogRootLayout from "@/pages/blogs/BlogRootLayout";
// import BlogPage from "@/pages/blogs/Blog";
// import BlogDetailPage from "@/pages/blogs/BlogDetail";
const BlogRootLayout = lazy(() => import("@/pages/blogs/BlogRootLayout"));
const BlogPage = lazy(() => import("@/pages/blogs/Blog"));
const BlogDetailPage = lazy(() => import("@/pages/blogs/BlogDetail"));

import ProductRootLayout from "@/pages/products/ProductRootLayout";
import ProductPage from "@/pages/products/Product";
import ProductDetailPage from "@/pages/products/ProductDetail";

import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";

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
      {
        path: "products",
        Component: ProductRootLayout,
        children: [
          { index: true, Component: ProductPage },
          { path: ":productId", Component: ProductDetailPage },
        ],
      },
    ],
  },

  {
    path: "/login",
    Component: LoginPage,
  },

  {
    path: "/register",
    Component: RegisterPage,
  },
]);
