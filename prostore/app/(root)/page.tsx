import ProductList from "@/components/shared/product/product-list";
import { Button } from "@/components/ui/button";
import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.actions";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  return (
    <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
  );
}
