import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";
import useSignUp from "@/hooks/auth/useSignUp";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupValues } from "@/schemas/auth.schema";

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
];

export function SignupPage() {
  const { mutate, isPending } = useSignUp();
  const { register, handleSubmit, formState, control } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = handleSubmit((values) => mutate(values));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">We'll email you a 6-digit code to verify it's you.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <FormField label="Full name" htmlFor="name" error={formState.errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Ada Okafor" aria-invalid={!!formState.errors.name} {...register("name")} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={formState.errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!formState.errors.email}
            {...register("email")}
          />
        </FormField>
        <FormField label="Password" htmlFor="password" error={formState.errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!formState.errors.password} {...register("password")} />
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(password);
              return (
                <li
                  key={r.label}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                    ok ? "bg-success-soft text-success-ink" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Check className={cn("size-3", !ok && "opacity-30")} /> {r.label}
                </li>
              );
            })}
          </ul>
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword" error={formState.errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={!!formState.errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </FormField>
        <Button type="submit" className="h-10 w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Create account <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
