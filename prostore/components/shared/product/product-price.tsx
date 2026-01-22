import { cn } from "@/lib/utils";

export default function ProductPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // two decimal places
  const stringValue = value.toFixed(2);

  // get the int float
  const [intPart, floatPart] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intPart}
      <span className="text-xs align-super">.{floatPart}</span>
    </p>
  );
}
