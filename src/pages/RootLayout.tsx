import { Outlet } from "react-router";
import Header from "@/components/layouts/Header";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
    </div>
  );
}

export default RootLayout;
