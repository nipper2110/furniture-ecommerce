import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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

const quantitySchema = z.object({
  quantity: z.coerce.number().min(0).default(1),
});

export default function Editable() {
  const form = useForm({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof quantitySchema>) {
    console.log(values);
    // Call api
    toast.success("Product is addede to cart successfully.");
  }

  return (
    <>
      <form
        id="form-rhf-input"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full justify-between"
      >
        <div className="flex w-31 items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
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
                      value={(field.value as number | undefined) ?? ""}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      min={0}
                      inputMode="numeric"
                      autoComplete="off"
                      className="h-8 w-16 rounded-none border-x-0"
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
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Add one item</span>
          </Button>
        </div>

        <Button
          type="button"
          aria-label="Delete cart item"
          size="icon"
          variant="outline"
          className="size-8"
        >
          <Icons.trash className="size-3" aria-hidden="true" />
          <span className="sr-only">Delete item</span>
        </Button>
      </form>
    </>
  );
}
