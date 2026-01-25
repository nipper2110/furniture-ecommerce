import MainNavigation from "./MainNavigation";
// import { siteConfig } from "@/config/site";

function Header() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center">
        <MainNavigation />
      </div>
    </header>
  );
}

export default Header;
