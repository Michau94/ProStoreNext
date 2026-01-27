import ProductList from "@/components/shared/product/product-list";
// import { Button } from "@/components/ui/button";
// import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Product } from "@/types";

export default async function HomePage() {
  const rawProducts = await getLatestProducts();

  const latestProducts: Product[] = rawProducts.map((product: any) => ({
    ...product,
    rating: Number(product.rating),
    price: Number(product.price),
  }));

  return (
    <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
  );
}
