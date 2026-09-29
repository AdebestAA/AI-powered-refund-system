import { LogoMark } from "./logo";

export function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <LogoMark className="size-10 animate-pulse" />
    </div>
  );
}
