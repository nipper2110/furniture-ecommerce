import { cn } from "@/lib/utils";
import { Link, useSubmit, useNavigation, useActionData } from "react-router";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./Password-Input";

const FormSchema = z.object({
  phone: z
    .string()
    .min(6, "Phone number is too short.")
    .max(12, "Phone number is too long.")
    .regex(/^\d+$/, "Phone number must be numbers."),
  password: z
    .string()
    .min(6, "Password must be 6 digits.")
    .max(6, "Password must be 6 digits.")
    .regex(/^\d+$/, "Password number must be numbers."),
});

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData() as {
    error?: string;
    message?: string;
  };

  const isSubmitting = navigation.state === "submitting";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    // console.log(values);
    submit(values, { method: "post", action: "/login" });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl lg:text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your phone number below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-rhf-input"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <FieldGroup>
              <div>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel id="form-rhf-input-email">
                        Phone Number
                      </FieldLabel>
                      <Input
                        type="tel"
                        placeholder="09x xxx xxxx"
                        required
                        inputMode="numeric"
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

            <FieldGroup>
              <div className="">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex">
                        <FieldLabel id="form-rhf-input-email">
                          Password
                        </FieldLabel>
                        <Link
                          to="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>

                      <PasswordInput
                        // placeholder="08x xxx xxxx"
                        required
                        inputMode="numeric"
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
            {actionData && (
              <p className="text-xs text-red-400"> {actionData?.message}</p>
            )}
            <div className="grid gap-4">
              <Button type="submit" className="mt-2 w-full cursor-pointer">
                {isSubmitting ? "Submitting..." : "Sign In"}
              </Button>
              <FieldSeparator>Or continue with</FieldSeparator>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                type="button"
              >
                Sign In with Google
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="cursor-pointer underline">
                  Sign Up
                </Link>
              </FieldDescription>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
