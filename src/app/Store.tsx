"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
  created_at: string; // Add created_at for date-based sorting
}

interface User {
  id: string;
  email?: string;
  // Add other properties as needed
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // Default sorting: most recent first
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter box visibility
  const [currentPage, setCurrentPage] = useState(0); // State to manage current page
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({}); // State to manage active image index for each product
  const [user, setUser] = useState<User | null>(null); // State to store the authenticated user
  const storeTopRef = useRef<HTMLDivElement>(null); // Ref for the top of the Store component

  // Fetch the authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the 'products' table
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }); // Default sorting by most recent

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

  // Add to Cart Functionality
  const addToCart = async (product: Product) => {
    try {
      // Fetch the current user's cart
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("cart")
        .eq("email", user?.email) // Assuming you have access to the authenticated user
        .single();

      if (userError) throw userError;

      // Parse the current cart or initialize an empty array
      const currentCart = userData?.cart || [];

      // Check if the product is already in the cart
      const existingProductIndex = currentCart.findIndex(
        (item: Product) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // If the product is already in the cart, update its quantity (if applicable)
        // For example, increment the quantity
        currentCart[existingProductIndex].quantity += 1;
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        currentCart.push({ ...product, quantity: 1 });
      }

      // Update the cart in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({ cart: currentCart })
        .eq("email", user?.email);

      if (updateError) throw updateError;

      console.log("Product added to cart:", product.title);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  // Sort products based on the selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price; // Du - cher au + cher
      case "price_desc":
        return b.price - a.price; // Du + cher au - cher
      case "name_asc":
        return a.title.localeCompare(b.title); // De A à Z
      case "name_desc":
        return b.title.localeCompare(a.title); // De Z à A
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Du + récent au + ancien
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); // Du + ancien au + récent
      default:
        return 0;
    }
  });

  // Group products into chunks of 8
  const chunkSize = 8;
  const productChunks = [];
  for (let i = 0; i < sortedProducts.length; i += chunkSize) {
    productChunks.push(sortedProducts.slice(i, i + chunkSize));
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageChange = (productId: number, index: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  // Scroll to the top of the Store component when the page changes
  useEffect(() => {
    if (storeTopRef.current) {
      storeTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary py-8 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Magasin</h1>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md overflow-hidden animate-pulse w-72"
            >
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary py-8 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Magasin</h1>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div ref={storeTopRef} className="min-h-screen bg-primary py-8 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Magasin</h1>

      {/* Filter Button and Options */}
      <div className="flex justify-end mb-8 relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
        >
          <span className="text-sm font-medium text-gray-700">Trier par</span>
          <svg
            className={`h-5 w-5 ml-2 text-gray-700 transform transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
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

        {/* Filter Options Box */}
        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
            <div className="text-lg font-semibold mb-4">Trier par</div>
            <div
              onClick={() => {
                setSortBy("price_asc");
                setIsFilterOpen(false); // Close the filter box after selection
              }}
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                sortBy === "price_asc" ? "bg-gray-100" : ""
              }`}
            >
              Du - cher au + cher
            </div>
            <div
              onClick={() => {
                setSortBy("price_desc");
                setIsFilterOpen(false); // Close the filter box after selection
              }}
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                sortBy === "price_desc" ? "bg-gray-100" : ""
              }`}
            >
              Du + cher au - cher
            </div>
            <div
              onClick={() => {
                setSortBy("name_asc");
                setIsFilterOpen(false); // Close the filter box after selection
              }}
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                sortBy === "name_asc" ? "bg-gray-100" : ""
              }`}
            >
              De A à Z
            </div>
            <div
              onClick={() => {
                setSortBy("name_desc");
                setIsFilterOpen(false); // Close the filter box after selection
              }}
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                sortBy === "name_desc" ? "bg-gray-100" : ""
              }`}
            >
              De Z à A
            </div>
            <div
              onClick={() => {
                setSortBy("recent");
                setIsFilterOpen(false); // Close the filter box after selection
              }}
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                sortBy === "recent" ? "bg-gray-100" : ""
              }`}
            >
              Du + récent au + ancien
            </div>
            <div
              onClick={() => {
                setSortBy("oldest");
                setIsFilterOpen(false); // Close the filter box after selection
              }}
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                sortBy === "oldest" ? "bg-gray-100" : ""
              }`}
            >
              Du + ancien au + récent
            </div>
          </div>
        )}
      </div>

      {/* Product List */}
      {sortedProducts.length === 0 ? (
        <div className="text-center text-accent">No products available.</div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
            {productChunks[currentPage].map((product) => (
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
                  <h2 className="text-lg sm:text-xl font-semibold text-accent mb-2">{product.title}</h2>
                  <p>
                    <span className="text-xs text-gray-600">A partir de </span>
                    <span className="font-bold text-gray-700">{product.price.toFixed(2)} Dt</span>
                  </p>
                </Link>

                {/* Add to Cart Button */}
                <div className="p-4">
                  <button
                    className="w-full py-2 bg-secondary text-white font-semibold hover:bg-accent transition-colors duration-300"
                    onClick={() => addToCart(product)}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {productChunks.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border ${
                  currentPage === index
                    ? "bg-secondary text-white border-secondary"
                    : "bg-white text-gray-700 border-gray-300"
                } rounded-lg shadow-sm hover:bg-gray-50 hover:text-secondary transition-colors duration-300`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}