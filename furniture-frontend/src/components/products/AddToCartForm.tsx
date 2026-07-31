import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(4, "Too Many! Is it real?")
    .regex(/^\d+$/, "Must be a number."),
});

interface showByuNowProps {
  canBuy: boolean;
  onHandleCart: (quantiy: number) => void;
  idInCart: number;
}

export default function AddToCartForm({
  canBuy,
  onHandleCart,
  idInCart,
}: showByuNowProps) {
  const cartItem = useCartStore((state) =>
    state.carts.find((item) => item.id === idInCart),
  );

  const form = useForm({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: cartItem ? cartItem.quantity.toString() : "1",
    },
  });

  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  useEffect(() => {
    if (cartItem) {
      setValue("quantity", cartItem.quantity.toString(), {
        shouldValidate: true,
      });
    }
  }, [cartItem, setValue]);

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0); // Min limit 0
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 9999); // Max limit 9999
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };

  function onSubmit(values: z.infer<typeof quantitySchema>) {
    // console.log(values);
    // Call api
    onHandleCart(Number(values.quantity));
    toast.success(
      cartItem
        ? "Updated cart successfully."
        : "Product is added to cart successfully.",
    );
  }

  return (
    <>
      <form
        id="form-rhf-input"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-65 flex-col gap-4"
      >
        <div className="flex w-31 items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={currentQuantity <= 1}
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove one item</span>
          </Button>
          <FieldGroup>
            <div className="space-y-0">
              <Controller
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="sr-only">Quantity</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      min={1}
                      max={9999}
                      inputMode="numeric"
                      autoComplete="off"
                      className="h-8 w-16 [appearance:textfield] rounded-none border-x-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-l-none"
            onClick={handleIncrease}
            disabled={currentQuantity >= 9999}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Add one item</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            aria-label="Buy now"
            size="sm"
            className={cn(
              "w-full bg-[#3b5d50] font-bold",
              !canBuy && "bg-slate-400",
            )}
          >
            Buy Now
          </Button>
          <Button
            type="submit"
            aria-label="Add To Cart"
            variant={canBuy ? "outline" : "default"}
            size="sm"
            className="w-full font-semibold"
          >
            {cartItem ? "Update Cart" : "Add to cart"}
          </Button>
        </div>
      </form>
    </>
  );
}
