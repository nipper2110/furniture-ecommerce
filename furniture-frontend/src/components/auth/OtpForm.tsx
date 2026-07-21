import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import z from "zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  otp: z.string().min(6, "Your one-time password must be 6 passwords."),
});

export function InputOTPForm({
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
      otp: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    submit(data, { method: "POST", action: "/register/otp" });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>
              <Link
                to="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md">
                  <Icons.logo className="mr-2 h-6 w-6" aria-hidden="true" />
                </div>
                <span className="sr-only">Furniture Shop</span>
              </Link>

              <h1 className="mb-2 text-xl font-bold">
                We've sent OTP to your phone.
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Field>
              <form
                id="form-rhf-input"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                autoComplete="off"
              >
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="otp-verification">
                    OTP - One-Time Password
                  </FieldLabel>
                </div>
                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      {...field}
                      id="otp-verification"
                      pattern={REGEXP_ONLY_DIGITS}
                      required
                    >
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />

                {actionData && (
                  <p className="text-xs text-red-400"> {actionData?.message}</p>
                )}
                <div className="grid gap-4">
                  <Button type="submit" className="mt-2 w-full cursor-pointer">
                    {isSubmitting ? "Submitting..." : "Verify"}
                  </Button>
                </div>
              </form>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <div className="text-muted-foreground text-sm">
                Having trouble signing up?{" "}
                <a
                  href="#"
                  className="hover:text-primary underline underline-offset-4 transition-colors"
                >
                  Contact support
                </a>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
