"use client";

import { useEffect, useState, useRef, useCallback, useMemo, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/app/Navbar";
import Informations from "@/app/Informations";
import Footer from "@/app/Footer";
import Loading from "@/app/Loading";

interface Product {
  id: number;
  title: string;
  price: number;
  promo?: number;
  image_urls: string[];
  colors?: string[];
  status: boolean;
  created_at: string;
  sales?: number; // Added sales field
}

interface FilterOption {
  value: string;
  label: string;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const router = useRouter();
  const { category } = use(params);
  const decodedCategory = decodeURIComponent(category).replace(/-/g, " ");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({});
  const pageTopRef = useRef<HTMLDivElement>(null);

  const filterOptions: FilterOption[] = [
    { value: "price_asc", label: "Du - cher au + cher" },
    { value: "price_desc", label: "Du + cher au - cher" },
    { value: "name_asc", label: "De A à Z" },
    { value: "name_desc", label: "De Z à A" },
    { value: "recent", label: "Du + récent au + ancien" },
    { value: "oldest", label: "Du + ancien au + récent" },
    { value: "best_selling", label: "Meilleures ventes" }, // Added best selling option
  ];

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", decodedCategory);

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [decodedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.promo || a.price) - (b.promo || b.price);
        case "price_desc":
          return (b.promo || b.price) - (a.promo || a.price);
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "best_selling":
          return (b.sales || 0) - (a.sales || 0); // Sort by sales descending
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

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
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleImageChange = useCallback((productId: number, index: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [productId]: index }));
  }, []);

  const handleProductClick = useCallback((product: Product, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isImageSlider = target.closest(".image-slider") || target.tagName === "IMG";
    const isArrowButton = target.closest('button[aria-label*="image"]');

    if (!isImageSlider && !isArrowButton) {
      router.push(`/${product.title.replace(/\s+/g, "-").toLowerCase()}`);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="md:pt-48 pt-20 bg-primary">
        <Navbar />
        <Loading />
        <Informations />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:pt-48 pt-20 bg-primary">
        <Navbar />
        <div className="min-h-screen py-8 px-4 sm:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
        <Informations />
        <Footer />
      </div>
    );
  }

  return (
    <div ref={pageTopRef} className="md:pt-48 pt-20 bg-primary">
      <Navbar />
      <div className="min-h-screen py-8 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">
          {decodedCategory}
        </h1>

        <div className="flex justify-end mb-8 relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
            aria-label="Open filter options"
          >
            <span className="text-sm font-medium text-gray-700">Trier par</span>
            <svg
              className={`h-5 w-5 ml-2 text-gray-700 transform transition-transform duration-300 ${
                isFilterOpen ? "rotate-180" : ""
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

        {sortedProducts.length === 0 ? (
          <div className="text-center text-accent">Aucun produit disponible.</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
              {productChunks[currentPage].map((product) => (
                <div
                  key={product.id}
                  className="group hover:shadow-lg transition-colors duration-300 relative w-full hover:bg-white cursor-pointer"
                  onClick={(e) => handleProductClick(product, e)}
                > 
                  <div
                    className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center pt-4 overflow-hidden image-slider"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(
                          product.id,
                          (activeImageIndex[product.id] || 0) - 1 < 0
                            ? product.image_urls.length - 1
                            : (activeImageIndex[product.id] || 0) - 1
                        );
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(
                          product.id,
                          (activeImageIndex[product.id] || 0) + 1 >= product.image_urls.length
                            ? 0
                            : (activeImageIndex[product.id] || 0) + 1
                        );
                      }}
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

                  {product.promo ? (
                    <div className="p-4 text-center">
                      <h2 className="text-sm font-semibold text-gray-800 mb-2">{product.title}</h2>
                      <p className="space-x-4">
                        <span className="font-bold text-gray-700">{product.promo.toFixed(2)} Dt</span>
                        {product.price && (
                          <span className="text-gray-500 line-through">{product.price.toFixed(2)} Dt</span>
                        )}
                      </p>
                      <p>
                        {product.status ? (
                          <span className="text-green-600">En stock</span>
                        ) : (
                          <span className="text-red-600">Rupture de stock</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <h2 className="text-sm font-semibold text-gray-800 mb-2">{product.title}</h2>
                      <p className="space-x-4">
                        {product.price && (
                          <span className="font-bold text-gray-700">{product.price.toFixed(2)} Dt</span>
                        )}
                      </p>
                      <p>
                        {product.status ? (
                          <span className="text-green-600">En stock</span>
                        ) : (
                          <span className="text-red-600">Rupture de stock</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

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