import { formatPrice } from "@/lib/utils";
import type { Cart } from "@/types";
import { Separator } from "@/components/ui/separator";
import Editable from "./Editable";

interface CartProps {
  cart: Cart;
}

function CartItem({ cart }: CartProps) {
  return (
    <div className="mx-4 space-y-3">
      <div className="flex gap-4">
        <img
          src={cart.image.url}
          alt="cart pic"
          className="w-16 object-cover"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{cart.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(cart.price)} x {cart.quantity} ={" "}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
          <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
            {`${cart.category} / ${cart.subcategory}`}
          </span>
        </div>
      </div>
      <Editable />
      <Separator className="mb-3" />
    </div>
  );
}

export default CartItem;
