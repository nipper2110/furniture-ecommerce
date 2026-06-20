import { useState } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

const emailSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
});

export default function NewsLatterForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    console.log(values);
    setLoading(true);
    // Call api
  }

  return (
    <>
      <form
        id="form-rhf-input"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full pr-8 lg:pr-0"
        autoComplete="off"
      >
        <FieldGroup>
          <div className="relative space-y-0">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="sr-only" id="form-rhf-input-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="furniture@gmail.com"
                    autoComplete="off"
                    className="pr-12"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              size="icon"
              className="absolute top-1 right-[3.5px] z-20 size-7"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Icons.paperPlane className="size-3" aria-hidden="true" />
              )}

              <span className="sr-only">Join newsletter</span>
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
}
