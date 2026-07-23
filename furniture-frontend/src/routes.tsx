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

import { homeLoader, loginLoader, otpLoader } from "@/router/loader";
import {
  loginAction,
  logoutAction,
  otpAction,
  registerAction,
} from "@/router/action";
import SignUpPage from "@/pages/auth/SignUp";
import OtpPage from "@/pages/auth/Otp";
import ConfirmPasswordPage from "@/pages/auth/ConfirmPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage, loader: homeLoader },
      { path: "about", Component: AboutPage },
      {
        path: "blogs",
        // Component: BlogRootLayout,

        lazy: async () => {
          const module = await import("@/pages/blogs/BlogRootLayout");

          return {
            Component: module.default,
          };
        },
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
      { path: "confirm-password", Component: ConfirmPasswordPage },
    ],
  },

  {
    path: "/logout",
    action: logoutAction,
    loader: () => redirect("/"),
  },
]);
