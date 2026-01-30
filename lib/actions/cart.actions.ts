"use server";

import { CartItem } from "@/types";

export async function addItemToCart(data: CartItem) {
  // Logic to add item to cart (e.g., database operation)
  console.log("Adding to cart:", data);

  return { success: true, message: "Item added to cart" };
}
