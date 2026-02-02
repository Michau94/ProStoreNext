import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// format error
// eslink-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    console.log("ZodError", error);
    const fieldError = JSON.parse(error).map(
      (err: { message: string }) => err.message,
    );
    return fieldError.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta.driverAdapterError.cause.constraint.fields
      ? error.meta.driverAdapterError.cause.constraint.fields[0]
      : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

// round number to 2 decimal places
export function roundToTwoDecimals(num: number | string): number {
  if (typeof num === "number") {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  } else if (typeof num === "string") {
    return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Invalid number format");
  }
}
