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

interface User {
  id: string;
  email?: string;
  // Add other properties as needed
}

export default function ProductPage() {
  const { product } = useParams(); // Get the formatted product title from the URL
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the selected image
  const [user, setUser] = useState<User | null>(null); // State to store the authenticated user
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to manage button disabled state

  // Fetch the authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  // Add to Cart Functionality
  const addToCart = async (product: Product) => {
    try {
      if (!user) {
        alert("Please log in to add products to your cart.");
        return;
      }

      // Disable the button
      setIsButtonDisabled(true);

      // Fetch the current user's cart
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("cart")
        .eq("email", user.email)
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
        .eq("email", user.email);

      if (updateError) throw updateError;

      console.log("Product added to cart:", product.title);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    } finally {
      // Re-enable the button after 3 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

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
      <div className="max-w-6xl mx-auto p-6 my-8 md:pt-48 pt-20 flex flex-col md:flex-row gap-8">
        {/* Image Slider Section */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails (Left Side) */}
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

          {/* Main Image (Right Side) */}
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
            className="w-full py-3 bg-secondary text-white font-semibold hover:bg-accent transition-colors duration-300 rounded-lg disabled:cursor-not-allowed disabled:bg-accent"
            onClick={() => addToCart(productData)}
            disabled={isButtonDisabled}
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