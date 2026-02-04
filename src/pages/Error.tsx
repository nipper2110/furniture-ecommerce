import { Link } from "react-router";
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/layouts/Footer";
import { Icons } from "@/components/icons";

function Error() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="mx-auto my-32 flex flex-1 items-center">
        <Card className="w-80 sm:w-125 md:w-125 lg:w-125">
          <CardHeader className="flex-col place-items-center gap-2">
            <div className="border-muted-foreground/70 mt-2 mb-4 grid size-24 place-items-center rounded-full border border-dashed">
              <Icons.exclamation
                className="text-muted-foreground/70 size-10"
                aria-hidde="true"
              />
            </div>
            <CardTitle>Oops!</CardTitle>
            <CardDescription>An error occurs accidently.</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Go to Home Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default Error;
