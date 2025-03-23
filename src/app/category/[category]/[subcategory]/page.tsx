"use client"; // Mark this component as a Client Component

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/Navbar";
import Informations from "@/app/Informations";
import Footer from "@/app/Footer";
import Loading from "@/app/Loading";

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
  colors?: string[]; // Optional colors array
}

interface FilterOption {
  value: string;
  label: string;
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

  // Filter and Sorting States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8;
  const productChunks = sortedProducts.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / productsPerPage);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // Start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as Product[][]);

  // Product Image Slider States
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({});

  // Color Selection States
  const [openColorDropdown, setOpenColorDropdown] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});

  // Add to Cart States
  const [disabledButtons, setDisabledButtons] = useState<{ [key: number]: boolean }>({});

  // Filter Options
  const filterOptions: FilterOption[] = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "title_asc", label: "Title: A to Z" },
    { value: "title_desc", label: "Title: Z to A" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Decode the category and subcategory names
        const decodedCategory = decodeURIComponent(category).replace(/-/g, " ");
        const decodedSubcategory = decodeURIComponent(subcategory).replace(/-/g, " ");

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
        setSortedProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err); // Debugging
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  useEffect(() => {
    // Sort products based on the selected filter
    const sorted = [...products];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "title_asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
    setCurrentPage(0); // Reset to the first page after sorting
  }, [sortBy, products]);

  const handleImageChange = (productId: number, newIndex: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };

  const toggleColorDropdown = (productId: number) => {
    setOpenColorDropdown((prev) => (prev === productId ? null : productId));
  };

  const handleColorChange = (productId: number, color: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
    setOpenColorDropdown(null);
  };

  const addToLocalStorage = (product: Product) => {
    // Simulate adding to cart
    setDisabledButtons((prev) => ({
      ...prev,
      [product.id]: true,
    }));
    setTimeout(() => {
      setDisabledButtons((prev) => ({
        ...prev,
        [product.id]: false,
      }));
    }, 2000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
    <div className="md:pt-48 pt-20 bg-primary">
      <Navbar />
      <Loading />
      <Informations />
      <Footer />
    </div>);
  }
  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="md:pt-48 pt-20 bg-primary">
      <Navbar />
      <div className="min-h-screen py-5">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {decodeURIComponent(subcategory).replace(/-/g, " ")}
        </h1>

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
          <div className="text-center text-accent">Aucun produit disponible.</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
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
      </div>
      <Informations />
      <Footer />
    </div>
  );
}