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
}

export default function ProductPage() {
  const { product } = useParams(); // Get the formatted product title from the URL
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the selected image

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Convert the URL parameter back to the original title format
        const originalTitle = (product as string).replace(/-/g, " ");

        // Fetch the product from Supabase
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .ilike("title", originalTitle) // Use `ilike` for case-insensitive search
          .single(); // Fetch a single product

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

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", productData?.title);
    // You can integrate a state management library (e.g., Redux, Zustand) or context API here
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index); // Update the selected image index
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
        <div className="text-center text-accent text-xl">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <div className="max-w-6xl mx-auto my-8 md:pt-48 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Slider Section */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* Thumbnails (Left Side) */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0">
              {productData.image_urls.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 md:w-20 md:h-20 cursor-pointer border-2 ${
                    selectedImageIndex === index
                      ? "border-accent"
                      : "border-transparent"
                  } rounded-lg overflow-hidden flex-shrink-0`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={imageUrl}
                    alt={`${productData.title} - Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {/* Main Image (Right Side) */}
            <div className="flex-1 relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
  {productData.image_urls[selectedImageIndex] ? (
    <Image
      src={productData.image_urls[selectedImageIndex]}
      alt={`${productData.title} - Main Image`}
      fill
      className="object-contain"
      unoptimized
      onLoadingComplete={() => console.log("Image loaded successfully")}
      onError={(e) => console.error("Image failed to load", e)}
    />
  ) : (
    <div className="flex items-center justify-center bg-gray-100 text-gray-500">
      Image not available
    </div>
  )}
</div>
          </div>

          {/* Product Information Section */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-accent mb-8">
              {productData.title}
            </h1>

            {/* Product Details */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 mb-4">
                {productData.description}
              </p>
              <p className="text-xl font-bold text-gray-700">
                {productData.price.toFixed(2)} Dt
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full py-3 bg-secondary text-white font-semibold hover:bg-accent transition-colors duration-300 rounded-lg"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      <Informations />
      <Footer />
    </div>
  );
}