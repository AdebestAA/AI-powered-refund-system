import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";

export function NotFoundPage() {
  const error = useRouteError();
  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <LogoMark className="size-10" />
      <p className="mt-8 font-mono text-sm text-primary">{is404 ? "404" : "Error"}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{is404 ? "Page not found" : "Something went wrong"}</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {is404 ? "The page you're looking for doesn't exist or has moved." : "An unexpected error occurred. Try reloading the page."}
      </p>
      <Button className="mt-8" asChild>
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}
