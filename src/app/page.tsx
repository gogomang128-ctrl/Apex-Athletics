import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import ClientHome from "@/components/ClientHome";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return allProducts;
  } catch {
    return [];
  }
}

export default async function Home() {
  const productList = await getProducts();
  return <ClientHome initialProducts={productList} />;
}
