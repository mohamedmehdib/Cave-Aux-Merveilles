"use client"; // Mark this component as a Client Component

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
}

export default function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const { category, subcategory } = use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Decode the category and subcategory names
        const decodedCategory = decodeURIComponent(category).replace(/-/g, " ");
        const decodedSubcategory = decodeURIComponent(subcategory).replace(/-/g, " "); // Replace "-" with spaces

        console.log("Decoded Category:", decodedCategory); // Debugging
        console.log("Decoded Subcategory:", decodedSubcategory); // Debugging

        // Fetch products by category and subcategory
        const { data, error } = await supabase
          .from("products") // Replace with your products table name
          .select("*")
          .eq("category", decodedCategory) // Match the category
          .eq("subcategory", decodedSubcategory); // Match the subcategory

        if (error) throw error;

        console.log("Fetched Products:", data); // Debugging

        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err); // Debugging
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Products in {decodeURIComponent(subcategory).replace(/-/g, " ")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            {/* Product Image */}
            <div className="relative h-48 w-full">
              <Image
                src={product.image_urls[0]} // Use the first image
                alt={product.title}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </div>
            {/* Product Title */}
            <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
            {/* Product Price */}
            <p className="text-gray-700">{product.price.toFixed(2)} Dt</p>
          </div>
        ))}
      </div>
    </div>
  );
}