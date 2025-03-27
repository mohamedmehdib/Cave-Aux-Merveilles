"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Loading from "../Loading";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Informations from "../Informations";

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
  description: string;
  colors?: string[];
}

export default function ProductPage() {
  const { product } = useParams();
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

  const addToLocalStorage = (product: Product) => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Svp sélectionnez une couleur avant ajouter au panier.");
      return;
    }

    try {
      setIsButtonDisabled(true);

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1, selectedColor });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      console.log("Product added to localStorage:", product.title);
    } catch (error) {
      console.error("Error adding to localStorage:", error);
      alert("Failed to add product to cart.");
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const originalTitle = (product as string).replace(/-/g, " ");

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .ilike("title", originalTitle)
          .single();

        if (error) {
          throw error;
        }

        setProductData(data);
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

    fetchProduct();
  }, [product]);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setIsColorDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Navbar />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center text-accent text-xl">Produit non trouvé.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 my-8 md:pt-48 pt-20 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] mx-auto">
            {productData.image_urls.map((imageUrl, index) => (
              <div
                key={index}
                className={`w-16 h-16 md:w-20 md:h-20 cursor-pointer border-2 ${
                  selectedImageIndex === index
                    ? "border-accent"
                    : "border-transparent"
                } rounded-lg overflow-hidden transition-all duration-300 hover:border-accent`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={imageUrl}
                  alt={`${productData.title} - Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full rounded-md"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <div className="flex-1 relative w-full h-[300px] md:h-[500px] overflow-hidden">
            <Image
              src={productData.image_urls[selectedImageIndex]}
              alt={`${productData.title} - Main Image`}
              width={500}
              height={500}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-accent mb-8">
            {productData.title}
          </h1>

          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">
              {productData.description}
            </p>
            <p className="text-xl font-bold text-gray-700">
              {productData.price.toFixed(2)} Dt
            </p>
          </div>

          {productData.colors && productData.colors.length > 0 && (
            <div className="mb-8 relative">
              <button
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                aria-label="Open color options"
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedColor || "Sélectionnez une couleur"}
                </span>
                <svg
                  className={`h-5 w-5 ml-2 text-gray-700 transform transition-transform duration-300 ${
                    isColorDropdownOpen ? "rotate-180" : ""
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

              {isColorDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-50">
                  <div className="flex flex-col gap-2">
                    {productData.colors.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-300 rounded-lg ${
                          selectedColor === color
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

          <button
            className="w-full py-3 bg-secondary text-white font-semibold hover:bg-accent transition-colors duration-300 rounded-lg disabled:cursor-not-allowed disabled:bg-accent"
            onClick={() => addToLocalStorage(productData)}
            disabled={isButtonDisabled || (productData.colors && productData.colors.length > 0 && !selectedColor)}
          >
            {isButtonDisabled ? "Ajouté avec succès!" : "Ajouter au panier"}
          </button>
        </div>
      </div>
      <Informations />
      <Footer />
    </div>
  );
}