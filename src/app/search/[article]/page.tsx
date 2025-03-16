"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { use } from "react";
import Navbar from "@/app/Navbar";
import Loading from "@/app/Loading";
import Footer from "@/app/Footer";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
  created_at: string;
}

interface SearchPageProps {
  params: Promise<{ article: string }>; // `params` is a Promise
}

// Fetch products based on the search query
async function fetchProducts(query: string) {
  try {
    // Fetch products from Supabase that match the search query
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("title", `%${query}%`); // Case-insensitive search for products with titles containing the query

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

export default function SearchPage({ params }: SearchPageProps) {
  const { article } = use(params); // `params` is already a Promise
  const decodedQuery = decodeURIComponent(article); // Decode the search query
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({}); // Track active image index for each product

  // Handle image change for the product slider
  const handleImageChange = (productId: number, newIndex: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };

  // Add to LocalStorage Functionality
  const addToLocalStorage = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Product added to localStorage:", product.title);
  };

  // Fetch products when the component mounts or the search query changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(decodedQuery);
        setProducts(data);
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

    loadProducts();
  }, [decodedQuery]);

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="mx-auto px-4 md:pt-48 pt-20">
          <h1 className="text-3xl font-bold text-gray-800 my-8 text-center">
            Résultats de la recherche pour: <span className="text-accent">{decodedQuery}</span>
          </h1>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-colors duration-300 relative w-full hover:bg-white"
                >
                  {/* Product Images Slider */}
                  <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center pt-4 overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${(activeImageIndex[product.id] || 0) * 100}%)`,
                        width: `${product.image_urls.length * 100}%`,
                      }}
                    >
                      {product.image_urls.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex-shrink-0"
                        >
                          <Image
                            src={imageUrl}
                            alt={`${product.title} - Image ${index + 1}`}
                            fill
                            className="object-contain p-7"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                    {/* Image Navigation Arrows */}
                    <button
                      onClick={() =>
                        handleImageChange(
                          product.id,
                          (activeImageIndex[product.id] || 0) - 1 < 0
                            ? product.image_urls.length - 1
                            : (activeImageIndex[product.id] || 0) - 1
                        )
                      }
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 shadow-md hover:bg-opacity-100 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        handleImageChange(
                          product.id,
                          (activeImageIndex[product.id] || 0) + 1 >= product.image_urls.length
                            ? 0
                            : (activeImageIndex[product.id] || 0) + 1
                        )
                      }
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 shadow-md hover:bg-opacity-100 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Product Details */}
                  <Link href={`/${product.title.replace(/\s+/g, "-").toLowerCase()}`} className="p-4 text-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-accent mb-2">
                      {product.title}
                    </h2>
                    <p>
                      <span className="text-xs text-gray-600">A partir de </span>
                      <span className="font-bold text-gray-700">{product.price.toFixed(2)} Dt</span>
                    </p>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="p-4">
                    <button
                      className="w-full py-3 bg-secondary text-white font-semibold hover:bg-accent transition-colors duration-300 rounded-lg"
                      onClick={() => addToLocalStorage(product)}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No products found for your search.</p>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}