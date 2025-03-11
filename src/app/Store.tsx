"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_urls: string[];
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the 'products' table
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Store</h1>

      {products.length === 0 ? (
        <div className="text-center text-accent">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Display the first image of the product */}
              {product.image_urls.length > 0 && (
                <Image
                  fill
                  src={product.image_urls[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold text-accent mb-2">{product.title}</h2>
                <p className="text-accent mb-4">{product.description}</p>
                <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}