import { z } from "zod";
import { productInsertSchema } from "../lib/validators";

export type Product = z.infer<typeof productInsertSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};
