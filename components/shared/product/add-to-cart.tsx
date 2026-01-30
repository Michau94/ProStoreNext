"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();

  async function handleAddCart() {
    const res = await addItemToCart(item);
    if (res.success) {
      toast.success(`${item.name} added to cart`, {
        action: { label: "View Cart", onClick: () => router.push("/cart") },
      });
    } else {
      toast.error("Error", {
        description: res.message || "Failed to add item to cart",
      });
    }
  }

  return (
    <Button className="w-full" type="button" onClick={handleAddCart}>
      <Plus />
      Add To Cart
    </Button>
  );
}
