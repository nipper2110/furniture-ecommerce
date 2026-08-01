import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { AxiosError } from "axios";
import * as z from "zod";

import api from "@/api/index";
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

const FormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be 6 digits.")
      .max(6, "Current password must be 6 digits.")
      .regex(/^\d+$/, "Current password must contain only numbers."),

    newPassword: z
      .string()
      .min(6, "New password must be 6 digits.")
      .max(6, "New password must be 6 digits.")
      .regex(/^\d+$/, "New password must contain only numbers."),

    confirmNewPassword: z
      .string()
      .min(6, "Confirm password must be 6 digits.")
      .max(6, "Confirm password must be 6 digits.")
      .regex(/^\d+$/, "Confirm password must contain only numbers."),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "New password must not be the same as current password.",
    path: ["newPassword"],
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

interface ChangePasswordFormProps extends React.ComponentProps<"div"> {
  onSuccess?: () => void;
}

export function ChangePasswordForm({
  className,
  onSuccess,
  ...props
}: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      setServerError(null);
      setSuccessMessage(null);

      const response = await api.post("change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setSuccessMessage(response.data.message);
      form.reset();

      onSuccess?.();
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(
          error.response?.data?.message ?? "Changing password failed.",
        );
      } else {
        setServerError("Changing password failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold">Change your password</h1>

          <FieldDescription>
            Enter your current password and choose a new 6-digit password.
          </FieldDescription>
        </div>

        <Field>
          <form
            id="change-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <FieldGroup>
              <div className="space-y-5">
                <Controller
                  name="currentPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="current-password">
                        Current Password
                      </FieldLabel>

                      <PasswordInput
                        id="current-password"
                        required
                        inputMode="numeric"
                        autoComplete="current-password"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="newPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="new-password">
                        New Password
                      </FieldLabel>

                      <PasswordInput
                        id="new-password"
                        required
                        inputMode="numeric"
                        autoComplete="new-password"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmNewPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirm-new-password">
                        Confirm New Password
                      </FieldLabel>

                      <PasswordInput
                        id="confirm-new-password"
                        required
                        inputMode="numeric"
                        autoComplete="new-password"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            {serverError && (
              <p className="text-xs text-red-400">{serverError}</p>
            )}

            {successMessage && (
              <p className="text-xs text-green-500">{successMessage}</p>
            )}

            <div className="grid gap-4">
              <Button
                type="submit"
                className="mt-4 w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Field>
      </FieldGroup>
    </div>
  );
}
