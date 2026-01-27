import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";
import { siteConfig } from "@/config/site";

function Header() {
  return (
    <header className="w-full border-b">
      <nav className="container mx-auto flex h-16 items-center">
        <MainNavigation items={siteConfig.mainNav} />
        <MobileNavigation items={siteConfig.mainNav} />
      </nav>
    </header>
  );
}

export default Header;
