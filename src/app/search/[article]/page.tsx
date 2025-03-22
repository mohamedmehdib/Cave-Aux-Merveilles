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
  colors?: string[]; // Add colors field
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
  const [disabledButtons, setDisabledButtons] = useState<{ [key: number]: boolean }>({}); // Track disabled state per product
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({}); // Track selected color for each product
  const [openColorDropdown, setOpenColorDropdown] = useState<number | null>(null); // Track which product's color dropdown is open

  // Handle image change for the product slider
  const handleImageChange = (productId: number, newIndex: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };

  // Add to LocalStorage Functionality
  const addToLocalStorage = (product: Product) => {
    const selectedColor = selectedColors[product.id];
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Svp sélectionnez une couleur avant ajouter au panier.");
      return;
    }

    // Disable the button for this specific product
    setDisabledButtons((prev) => ({ ...prev, [product.id]: true }));

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, selectedColor });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Product added to localStorage:", product.title);

    // Re-enable the button after 3 seconds
    setTimeout(() => {
      setDisabledButtons((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  // Handle color selection
  const handleColorChange = (productId: number, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
    setOpenColorDropdown(null); // Close the dropdown after selection
  };

  // Toggle color dropdown
  const toggleColorDropdown = (productId: number) => {
    setOpenColorDropdown((prev) => (prev === productId ? null : productId));
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
                  className="group hover:shadow-lg transition-colors duration-300 relative w-full hover:bg-white"
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

                  {/* Color Selection Dropdown */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="p-4 relative">
                      <button
                        onClick={() => toggleColorDropdown(product.id)}
                        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                        aria-label="Open color options"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {selectedColors[product.id] || "Sélectionnez une couleur"}
                        </span>
                        <svg
                          className={`h-5 w-5 ml-2 text-gray-700 transform transition-transform duration-300 ${
                            openColorDropdown === product.id ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {openColorDropdown === product.id && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-50">
                          <div className="flex flex-col gap-2">
                            {product.colors.map((color) => (
                              <div
                                key={color}
                                onClick={() => handleColorChange(product.id, color)}
                                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 rounded-lg ${
                                  selectedColors[product.id] === color
                                    ? "bg-secondary text-white"
                                    : "bg-gray-50"
                                }`}
                              >
                                {color}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <div className="p-4">
                    <button
                      className="w-full py-3 bg-secondary text-white font-semibold hover:bg-accent transition-colors duration-300 rounded-lg disabled:cursor-not-allowed disabled:bg-accent"
                      onClick={() => addToLocalStorage(product)}
                      disabled={disabledButtons[product.id] || false} // Disable only the clicked product's button
                    >
                      {disabledButtons[product.id] ? "Ajouté avec succès!" : "Ajouter au panier"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun produit trouvé pour votre recherche.</p>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}