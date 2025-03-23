"use client"; // Mark this component as a Client Component

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/Navbar";
import Informations from "@/app/Informations";
import Footer from "@/app/Footer";

// Define the PageProps interface
interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
  colors?: string[]; // Add colors field
  created_at: string;
  category: string;
  subcategory: string;
}

const filterOptions = [
  { value: "price_asc", label: "Du - cher au + cher" },
  { value: "price_desc", label: "Du + cher au - cher" },
  { value: "name_asc", label: "De A à Z" },
  { value: "name_desc", label: "De Z à A" },
  { value: "recent", label: "Du + récent au + ancien" },
  { value: "oldest", label: "Du + ancien au + récent" },
];

export default function SubcategoryPage({ params, searchParams }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [decodedCategory, setDecodedCategory] = useState("");
  const [decodedSubcategory, setDecodedSubcategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({});
  const [disabledButtons, setDisabledButtons] = useState<{ [key: number]: boolean }>({});
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [openColorDropdown, setOpenColorDropdown] = useState<number | null>(null);
  const storeTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Decode the category and subcategory names and replace hyphens with spaces
        const decodedCat = decodeURIComponent(params.category).replace(/-/g, " ");
        const decodedSubcat = decodeURIComponent(params.subcategory).replace(/-/g, " ");
        setDecodedCategory(decodedCat);
        setDecodedSubcategory(decodedSubcat);

        // Fetch products by category and subcategory
        const { data, error } = await supabase
          .from("products") // Replace with your products table name
          .select("*")
          .eq("category", decodedCat) // Match the category
          .eq("subcategory", decodedSubcat); // Match the subcategory

        if (error) throw error;
        setProducts(data || []);

        // Handle searchParams if needed
        if (searchParams) {
          console.log("Search Params:", searchParams);
          // You can use searchParams here if needed
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, searchParams]);

  // Add to LocalStorage Functionality
  const addToLocalStorage = useCallback((product: Product) => {
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
  }, [selectedColors]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  // Pagination
  const chunkSize = 8;
  const productChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < sortedProducts.length; i += chunkSize) {
      chunks.push(sortedProducts.slice(i, i + chunkSize));
    }
    return chunks;
  }, [sortedProducts]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (storeTopRef.current) {
      storeTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleImageChange = useCallback((productId: number, index: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [productId]: index }));
  }, []);

  const handleColorChange = useCallback((productId: number, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
    setOpenColorDropdown(null); // Close the dropdown after selection
  }, []);

  const toggleColorDropdown = useCallback((productId: number) => {
    setOpenColorDropdown((prev) => (prev === productId ? null : productId));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary md:pt-48 pt-20">
        <Navbar />
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">
          Categorie: {decodedCategory}
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Sous categorie: {decodedSubcategory}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white shadow-md overflow-hidden animate-pulse w-72">
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
      <div className="min-h-screen bg-primary md:pt-48 pt-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">
          Categorie: {decodedCategory}
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Sous categorie: {decodedSubcategory}
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div ref={storeTopRef} className="min-h-screen bg-primary md:pt-48 pt-20">
      <Navbar />
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent my-8">
        Categorie: {decodedCategory}
      </h1>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Sous categorie: {decodedSubcategory}
      </h2>

      {/* Filter Button and Options */}
      <div className="flex justify-end m-8 relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
          aria-label="Open filter options"
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
        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
            <div className="text-lg font-semibold mb-4">Trier par</div>
            {filterOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setIsFilterOpen(false);
                }}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ${
                  sortBy === option.value ? "bg-gray-100" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product List */}
      {sortedProducts.length === 0 ? (
        <div className="text-center text-accent pb-5">Aucun produit disponible.</div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
            {productChunks[currentPage].map((product) => (
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
                          priority={index === 0}
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
                    aria-label="Previous image"
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
                    aria-label="Next image"
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
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{product.title}</h2>
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
                    aria-label="Add to cart"
                  >
                    {disabledButtons[product.id] ? "Ajouté avec succès!" : "Ajouter au panier"}
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
                aria-label={`Go to page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <Informations />
      <Footer />
    </div>
  );
}