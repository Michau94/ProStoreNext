"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  console.log(images);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt={`Product image ${current + 1}`}
        width={1000}
        height={1000}
        className="min-h-75
        object-cover
        object-center"
      />
      <div className="flex">
        {images.map((img, index) => (
          <div
            key={img}
            onClick={() => setCurrent(index)}
            className={cn(
              "mr-2 cursor-pointer border-2 hover:border-orange-600",
              current === index ? "border-orange-500" : "border-transparent",
            )}
          >
            <Image
              src={img}
              alt={`Thumbnail image ${index + 1}`}
              height={100}
              width={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
