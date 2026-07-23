import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./Password-Input";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const FormSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be 6 digits.")
    .max(6, "Password must be 6 digits.")
    .regex(/^\d+$/, "Password number must be numbers."),
  confirmPassword: z
    .string()
    .min(6, "Password must be 6 digits.")
    .max(6, "Password must be 6 digits.")
    .regex(/^\d+$/, "Password number must be numbers."),
});

export function ConfirmPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData() as {
    error?: string;
    message?: string;
  };

  const [clientError, setClientError] = useState<string | null>(null);

  const isSubmitting = navigation.state === "submitting";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    // console.log(values);
    if (values.password !== values.confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }
    setClientError(null);
    submit(values, { method: "post", action: "/register/confirm-password" });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <Icons.logo className="mr-2 h-6 w-6" aria-hidden="true" />
            </div>
            <span className="sr-only">Confirm Password</span>
          </a>
          <h1 className="text-xl font-bold">Please confirm your password</h1>
          <FieldDescription>
            Password must be 6 digits long and contain only numbers. They must
            match.
          </FieldDescription>
        </div>
        <Field>
          <form
            id="form-rhf-input"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <FieldGroup>
              <div className="space-y-5">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel id="form-rhf-input-email">
                        Password
                      </FieldLabel>
                      <PasswordInput required inputMode="numeric" {...field} />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel id="form-rhf-input-email">
                        Confirm Password
                      </FieldLabel>
                      <PasswordInput required inputMode="numeric" {...field} />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            {actionData && (
              <div className="flex gap-2">
                <p className="text-xs text-red-400"> {actionData?.message}</p>
                <Link
                  to="/register"
                  className="text-xs underline underline-offset-4"
                >
                  Go back to register
                </Link>
              </div>
            )}
            {clientError && (
              <p className="text-xs text-red-400"> {clientError}</p>
            )}
            <div className="grid gap-4">
              <Button type="submit" className="mt-4 w-full cursor-pointer">
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </form>
        </Field>
      </FieldGroup>
    </div>
  );
}
