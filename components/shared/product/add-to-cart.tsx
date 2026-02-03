"use client";

import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

export default function AddToCart({
  item,
  cart,
}: {
  item: CartItem;
  cart?: Cart;
}) {
  const router = useRouter();

  async function handleAddCart() {
    const res = await addItemToCart(item);
    if (res.success) {
      toast.success(res.message, {
        action: { label: "View Cart", onClick: () => router.push("/cart") },
      });
    } else {
      toast.error("Error", {
        description: res.message || "Failed to add item to cart",
      });
    }
  }

  // handle remove from cart

  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    if (res.success) {
      toast.success(res.message, {
        action: { label: "View Cart", onClick: () => router.push("/cart") },
      });
    } else {
      toast.error("Error", {
        description: res.message || "Failed to remove item from cart",
      });
    }

    return;
  };

  // check if item is already in cart
  const existItem =
    cart && cart?.items.find((i) => i.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4"></Minus>
      </Button>
      <span className="px-2">{existItem.qty}</span>

      <Button type="button" variant="outline" onClick={handleAddCart}>
        <Plus className="h-4 w-4"></Plus>
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddCart}>
      Add to Cart
    </Button>
  );
}
