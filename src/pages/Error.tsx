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

function Error() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex flex-1 items-center">
        <Card className="w-80 sm:w-125 md:w-125 lg:w-125">
          <CardHeader>
            <CardTitle className="text-center">Oops!</CardTitle>
            <CardDescription className="text-center">
              An error occurs accidently.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Go to Home Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default Error;
