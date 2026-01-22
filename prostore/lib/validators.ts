import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places",
  );

// schema inserting products
export const productInsertSchema = z.object({
  name: z.string().min(3, "Name is required and at least 3 characters long"),
  slug: z.string().min(3, "Slug is required and at least 3 characters long"),
  category: z
    .string()
    .min(3, "Category is required and at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 10 characters long"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
