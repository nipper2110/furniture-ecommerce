import SuspenseFallback from "@/Suspense Fallback/SuspenseFallback";
import { Suspense } from "react";
import { Outlet } from "react-router";

function BlogRootLayout() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Outlet />;
    </Suspense>
  );
}

export default BlogRootLayout;
