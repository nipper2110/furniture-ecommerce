import { Link } from "react-router";
import { Icons } from "@/components/icons";
import Banner from "@/data/images/house.webp";
import LoginForm from "@/components/auth/LoginForm";

function Login() {
  return (
    <div className="relative">
      <Link
        to="/"
        className="text-foreground/80 hover:text-foreground fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight transition-colors"
      >
        <Icons.logo className="mr-2 size-5" aria-hidden="true" />
        <span>Furniture Shop</span>
      </Link>

      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full place-items-center justify-center px-4">
          <LoginForm className="w-100" />
        </div>
        <div className="relative hidden size-full lg:block">
          <img
            src={Banner}
            alt="Furniture Shop"
            className="absolute inset-0 min-h-screen object-cover"
          ></img>
        </div>
      </main>
    </div>
  );
}

export default Login;
