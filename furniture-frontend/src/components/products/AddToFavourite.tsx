import { useFetcher } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface FavouriteProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  rating: number;
  isFavourite: boolean;
}

function AddToFavourite({
  productId,
  // rating,
  className,
  isFavourite,
  ...props
}: FavouriteProp) {
  const fetcher = useFetcher({ key: `products:${productId}` });

  let favourite = isFavourite;
  if (fetcher.formData) {
    favourite = fetcher.formData.get("favourite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <Button
        variant="secondary"
        size="icon"
        className={cn("size-8 shrink-0", className)}
        name="favourite"
        value={favourite ? "false" : "true"}
        title={favourite ? "Remove from favourites" : "Add to favourties"}
        {...props}
      >
        {favourite ? (
          <Icons.heartFill className="size-4 text-red-500" />
        ) : (
          <Icons.heart className="size-4 text-red-500" />
        )}
      </Button>
    </fetcher.Form>
  );
}

export default AddToFavourite;
