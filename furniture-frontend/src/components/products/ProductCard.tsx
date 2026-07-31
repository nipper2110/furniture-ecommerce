import { Link } from "react-router";
import { Icons } from "@/components/icons";
import type { Product } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
}

const imageURL = import.meta.env.VITE_IMG_URL;

function ProductCard({ product, className }: ProductProps) {
  const { carts, addItem } = useCartStore();
  const cartItem = carts.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].path,
      quantity: 1,
    });
  };

  return (
    <Card
      className={cn("size-full overflow-hidden rounded-lg pt-0", className)} // from utils.lib
    >
      <Link to={`/products/${product.id}`} aria-label={product.name}>
        <AspectRatio ratio={1 / 1} className="bg-muted">
          <img
            src={imageURL + product.images[0].path}
            alt="product image"
            className="size-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </AspectRatio>
        <CardContent className="space-y-1.5 p-4 pb-0">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.price)}
            {product.discount > 0 && (
              <span className="ml-2 font-extralight line-through">
                {formatPrice(product.discount)}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-1 pb-0">
        {product.status === "INACTIVE" ? (
          <Button
            size="sm"
            disabled={true}
            aria-label="Sold Out"
            className="h-8 w-full rounded-sm font-bold"
          >
            Sold Out
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-8 w-full rounded-sm bg-[#3b5d50] font-bold hover:bg-[#264137]"
            onClick={handleAddToCart}
            disabled={!!cartItem}
          >
            {!cartItem && <Icons.plus className="" />}
            {!cartItem ? "Add To Cart" : "Added Item"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
