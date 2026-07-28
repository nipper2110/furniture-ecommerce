import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";

import RootLayout from "@/pages/RootLayout";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import ErrorPage from "@/pages/Error";
// import BlogRootLayout from "@/pages/blogs/BlogRootLayout";
// import BlogPage from "@/pages/blogs/Blog";
// import BlogDetailPage from "@/pages/blogs/BlogDetail";
// const BlogRootLayout = lazy(() => import("@/pages/blogs/BlogRootLayout"));
const BlogPage = lazy(() => import("@/pages/blogs/Blog"));
const BlogDetailPage = lazy(() => import("@/pages/blogs/BlogDetail"));

import ProductRootLayout from "@/pages/products/ProductRootLayout";
import ProductPage from "@/pages/products/Product";
import ProductDetailPage from "@/pages/products/ProductDetail";
import LoginPage from "@/pages/auth/Login";
import AuthRootLayout from "@/pages/auth/AuthRootLayout";

import {
  confirmLoader,
  homeLoader,
  loginLoader,
  otpLoader,
  postLoader,
  productInfiniteLoader,
  productLoader,
} from "@/router/loader";
import {
  confirmAction,
  loginAction,
  logoutAction,
  otpAction,
  registerAction,
} from "@/router/action";
import SignUpPage from "@/pages/auth/SignUp";
import OtpPage from "@/pages/auth/Otp";
import ConfirmPasswordPage from "@/pages/auth/ConfirmPassword";
// import BlogRootLayout from "@/pages/blogs/BlogRootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        Component: HomePage,
        loader: homeLoader,
      },
      { path: "about", Component: AboutPage },
      {
        path: "blogs",
        // Component: BlogRootLayout,
        // loader: blogInfiniteLoader,

        lazy: async () => {
          const module = await import("@/pages/blogs/BlogRootLayout");
          const { blogInfiniteLoader } = await import("@/router/loader");
          return {
            Component: module.default,
            loader: blogInfiniteLoader,
          };
        },
        children: [
          { index: true, Component: BlogPage },
          { path: ":postId", Component: BlogDetailPage, loader: postLoader },
        ],
      },
      {
        path: "products",
        Component: ProductRootLayout,
        children: [
          {
            index: true,
            Component: ProductPage,
            loader: productInfiniteLoader,
          },
          {
            path: ":productId",
            Component: ProductDetailPage,
            loader: productLoader,
          },
        ],
      },
    ],
  },

  {
    path: "/login",
    Component: LoginPage,
    loader: loginLoader,
    action: loginAction,
  },

  {
    path: "/register",
    Component: AuthRootLayout,
    children: [
      {
        index: true,
        Component: SignUpPage,
        loader: loginLoader,
        action: registerAction,
      },
      { path: "otp", Component: OtpPage, loader: otpLoader, action: otpAction },
      {
        path: "confirm-password",
        Component: ConfirmPasswordPage,
        loader: confirmLoader,
        action: confirmAction,
      },
    ],
  },

  {
    path: "/logout",
    action: logoutAction,
    loader: () => redirect("/"),
  },
]);
