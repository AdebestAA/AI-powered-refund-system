import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, MailCheck, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { OtpInput } from "@/components/shared/otp-input";
import useResendOtp from "@/hooks/auth/useResendOtp";
import useVerifyOtp from "@/hooks/auth/useVerifyOtp";
import { verifyOtpSchema, type VerifyOtpValues } from "@/schemas/auth.schema";

const COOLDOWN = 30;

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const emailFromUrl = params.get("email") ?? "";

  const verify = useVerifyOtp();
  const resend = useResendOtp();
  const [cooldown, setCooldown] = useState(COOLDOWN);

  const { control, register, handleSubmit, formState, getValues, setValue } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: emailFromUrl, otp: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onSubmit = handleSubmit((values) =>
    verify.mutate(values, {
      onError: () => setValue("otp", ""),
    }),
  );

  const onResend = () =>
    resend.mutate(getValues("email"), {
      onSuccess: () => setCooldown(COOLDOWN),
    });

  return (
    <div>
      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <MailCheck className="size-7" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Enter your code</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-foreground">{emailFromUrl || "your email"}</span>. It expires in 10 minutes.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        {!emailFromUrl && (
          <FormField label="Email" htmlFor="email" error={formState.errors.email?.message}>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          </FormField>
        )}

        <FormField label="Verification code" error={formState.errors.otp?.message}>
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <OtpInput
                value={field.value}
                disabled={verify.isPending}
                invalid={!!formState.errors.otp}
                onChange={(value) => {
                  field.onChange(value);
                  if (value.length === 6) onSubmit();
                }}
              />
            )}
          />
        </FormField>

        <Button type="submit" className="h-10 w-full" disabled={verify.isPending}>
          {verify.isPending ? <Loader2 className="animate-spin" /> : "Verify email"}
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Didn't get it?</span>
        <Button variant="link" className="h-auto p-0" disabled={cooldown > 0 || resend.isPending} onClick={onResend}>
          {resend.isPending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </Button>
      </div>

      <Button variant="ghost" className="mt-6 w-full" asChild>
        <Link to="/login">Back to sign in</Link>
      </Button>

      <div className="mt-6 flex gap-3 rounded-xl border border-dashed bg-muted/40 p-4">
        <Terminal className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Running locally without a Brevo key? The code is printed in the API server's console.
        </p>
      </div>
    </div>
  );
}
