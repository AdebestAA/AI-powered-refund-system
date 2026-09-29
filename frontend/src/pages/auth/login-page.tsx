import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";
import useLogin from "@/hooks/auth/useLogin";
import { loginSchema, type LoginValues } from "@/schemas/auth.schema";

const DEMO_ACCOUNTS = [
  { label: "Customer", email: "ada@resolve.dev", password: "Password123!" },
  { label: "Admin", email: "admin@resolve.dev", password: "Admin123!" },
];

export function LoginPage() {
  const { mutate, isPending } = useLogin();

  const { register, handleSubmit, formState, setValue } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => mutate(values));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Welcome back. Sign in to manage your orders and refunds.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
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
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!formState.errors.password}
            {...register("password")}
          />
        </FormField>
        <Button type="submit" className="h-10 w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Sign in <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Got a verification code?{" "}
        <Link to="/verify-email" className="font-medium text-primary hover:underline">
          Verify your email
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-dashed bg-muted/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Demo accounts</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => {
                setValue("email", a.email, { shouldValidate: true });
                setValue("password", a.password, { shouldValidate: true });
              }}
              className="rounded-lg border bg-card px-3 py-2 text-left transition hover:border-primary/40 hover:shadow-sm"
            >
              <span className="block text-xs font-semibold">{a.label}</span>
              <span className="block truncate font-mono text-[11px] text-muted-foreground">{a.email}</span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[11px] text-muted-foreground">
          Every seeded customer (grace@, alan@, linus@ … @resolve.dev) uses <span className="font-mono">Password123!</span>
        </p>
      </div>
    </div>
  );
}
