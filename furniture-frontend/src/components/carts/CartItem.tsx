import { formatPrice } from "@/lib/utils";
import type { Cart } from "@/types";
import { Separator } from "@/components/ui/separator";
import Editable from "./Editable";
import { useCartStore } from "@/store/cartStore";

interface CartProps {
  cart: Cart;
}

const imageURL = import.meta.env.VITE_IMG_URL;

function CartItem({ cart }: CartProps) {
  const { updateItem, removeItem } = useCartStore();

  const updateHandler = (quantity: number) => {
    updateItem(cart.id, quantity);
  };

  const deleteHandler = () => {
    removeItem(cart.id);
  };
  return (
    <div className="mx-4 space-y-3">
      <div className="flex gap-4">
        <img
          src={imageURL + cart.image}
          alt="cart pic"
          loading="lazy"
          decoding="async"
          className="w-16 object-cover"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{cart.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(cart.price)} x {cart.quantity} ={" "}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
          {/* <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
            {`${cart.category} / ${cart.subcategory}`}
          </span> */}
        </div>
      </div>
      <Editable
        onDelete={deleteHandler}
        quantity={cart.quantity}
        onUpdate={updateHandler}
      />
      <Separator className="mb-3" />
    </div>
  );
}

export default CartItem;
