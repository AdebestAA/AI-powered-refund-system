import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, length = 6, invalid, disabled }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const setDigit = (i: number, digit: string) => {
    const next = digits.slice();
    next[i] = digit;
    onChange(next.join("").slice(0, length));
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i]) {
      e.preventDefault();
      setDigit(i - 1, "");
      focus(i - 1);
    } else if (e.key === "ArrowLeft") focus(i - 1);
    else if (e.key === "ArrowRight") focus(i + 1);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focus(pasted.length);
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onChange={(e) => {
            const digit = e.target.value.replace(/[^0-9]/g, "").slice(-1);
            setDigit(i, digit);
            if (digit) focus(i + 1);
          }}
          className={cn(
            "h-14 w-full min-w-0 rounded-xl border bg-background text-center font-mono text-2xl font-semibold shadow-xs transition outline-none",
            "focus:border-primary focus:ring-[3px] focus:ring-ring/40 disabled:opacity-50",
            invalid && "border-danger",
          )}
        />
      ))}
    </div>
  );
}
