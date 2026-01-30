"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";

export async function addItemToCart(data: CartItem) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("No session cart ID found");
    }

    // get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart

    const cart = await getMyCart();

    // parse and validate data

    const item = cartItemSchema.parse(data);

    // find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    // testing

    console.log(
      "Session Cart ID:",
      sessionCartId,
      " User ID:",
      userId,
      "Item Requested:",
      item,
      "Product Found:",
      product,
    );

    return { success: true, message: "Item added to cart" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("No session cart ID found");
  }

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  //   get cart

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice?.toString(),
  });
}
