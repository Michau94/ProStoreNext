"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import {
  convertToPlainObject,
  formatError,
  roundToTwoDecimals,
} from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma";

// calculate cart prices

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundToTwoDecimals(
    items.reduce((a, c) => a + Number(c.price) * c.qty, 0),
  );
  const shippingPrice = roundToTwoDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = roundToTwoDecimals(0.15 * itemsPrice);
  const totalPrice = roundToTwoDecimals(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

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

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add to database
      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${item.name} added to cart` };
    } else {
      // check if item already exists in cart
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.productId === item.productId,
      );

      if (existItem) {
        // check stock

        if (product.stock < existItem.qty + item.qty) {
          throw new Error("Insufficient stock available");
        }

        // udpate quantity
        (cart.items as CartItem[]).find(
          (i) => i.productId === item.productId,
        )!.qty = existItem.qty + 1;
      } else {
        // if item does not exist, add new item

        // check stock
        if (product.stock < 1) {
          throw new Error("Insufficient stock available");
        }

        // Add item to stock items

        cart.items.push(item);
      }
      // Save to database

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${item.name} ${existItem ? "updated in" : "added to"}  cart`,
      };
    }
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
