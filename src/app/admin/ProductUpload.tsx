"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

// Import Swiper styles and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Product {
  id?: number; // Optional for new products
  title: string;
  price: number;
  description: string; // Added description field
  image_urls: string[];
  created_at?: string; // Optional for new products
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sortBy] = useState("recent"); // Default sorting: most recent first
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Product being edited
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [description, setDescription] = useState(""); // Added description state
  const [fileInputs, setFileInputs] = useState<(File | null)[]>([null]); // Initialize with one null value

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(); // Du + récent au + ancien
      case "oldest":
        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime(); // Du + ancien au + récent
      default:
        return 0;
    }
  });

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Set the product to edit
    setTitle(product.title);
    setPrice(product.price);
    setDescription(product.description); // Set the description
    setFileInputs([null]); // Reset file inputs (you can pre-fill with existing images if needed)
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages
  };

  // Handle form submission (for both add and edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate input
      if (!title || price === null || !description || fileInputs.length === 0) {
        setError("Please fill out all fields and upload at least one image.");
        return;
      }

      // Filter out null values (empty file inputs)
      const validFiles = fileInputs.filter((file) => file !== null) as File[];

      // Upload images to Supabase Storage
      const imageUrls = await Promise.all(
        validFiles.map(async (file) => {
          const filePath = `products/${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(filePath, file);

          if (error) {
            throw error;
          }

          // Get the public URL of the uploaded image
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);

          return urlData.publicUrl;
        })
      );

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            title,
            price,
            description,
            image_urls: imageUrls,
          })
          .eq("id", editingProduct.id);

        if (error) {
          throw error;
        }

        // Update the local state
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === editingProduct.id
              ? { ...p, title, price, description, image_urls: imageUrls }
              : p
          )
        );

        setSuccess("Product updated successfully!");
      } else {
        // Insert new product
        const { error } = await supabase.from("products").insert([
          {
            title,
            price,
            description,
            image_urls: imageUrls,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          throw error;
        }

        // Refresh the product list
        const { data } = await supabase.from("products").select("*");
        setProducts(data || []);

        setSuccess("Product added successfully!");
      }

      // Reset form
      setTitle("");
      setPrice(null);
      setDescription("");
      setFileInputs([null]); // Reset to one empty file input
      setEditingProduct(null); // Reset editing mode
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for a specific input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = [...fileInputs];
      newFiles[index] = e.target.files[0]; // Replace the file at the current index
      setFileInputs(newFiles);

      // Add a new file input if this is the last input
      if (index === fileInputs.length - 1) {
        setFileInputs([...newFiles, null]); // Add a new empty slot
      }
    }
  };

  // Handle product deletion
  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) {
          throw error;
        }

        // Remove the product from the local state
        setProducts(products.filter((p) => p.id !== productId));
        setSuccess("Product deleted successfully!");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary py-8 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Store</h1>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Store</h1>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Store</h1>

      {/* Success Message */}
      {success && (
        <div className="text-center text-green-500 text-sm mb-4">{success}</div>
      )}

      {/* Always Visible Add/Edit Product Form */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              placeholder="Product Title"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              placeholder="Product Price"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={price ?? ""}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Product Description"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            {fileInputs.map((file, index) => (
              <div key={index} className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => handleImageUpload(e, index)}
                  required={index === 0 && !editingProduct} // Only the first input is required for new products
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full py-3 bg-accent text-white rounded-lg font-semibold shadow-lg transition-opacity duration-300 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading
              ? editingProduct
                ? "Updating..."
                : "Uploading..."
              : editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-lg hover:bg-gray-600 transition-colors duration-300"
              onClick={() => {
                setEditingProduct(null); // Reset editing mode
                setTitle(""); // Reset form fields
                setPrice(null);
                setDescription("");
                setFileInputs([null]); // Reset to one empty file input
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Product List */}
      {sortedProducts.length === 0 ? (
        <div className="text-center text-accent">No products available.</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group hover:bg-white overflow-hidden hover:shadow-lg transition-all duration-300 relative w-72 flex flex-col"
            >
              {/* Swiper Slider for Product Images */}
              <div className="relative w-full h-72 flex items-center justify-center pt-4">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: `.swiper-button-next-${product.id}`,
                    prevEl: `.swiper-button-prev-${product.id}`,
                  }}
                  loop={true} // Enable loop mode
                  className="w-full h-full"
                >
                  {product.image_urls.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={imageUrl}
                          alt={`${product.title} - Image ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <div
                  className={`swiper-button-prev-${product.id} absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
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
                </div>
                <div
                  className={`swiper-button-next-${product.id} absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
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
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 text-center flex-grow">
                <h2 className="text-xl font-semibold text-accent mb-2">{product.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <p>
                  <span className="text-xs text-gray-600">A partir de </span>
                  <span className="font-bold text-gray-700">{product.price.toFixed(2)} Dt</span>
                </p>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="p-4">
                <button
                  className="w-full py-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="w-full py-2 bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-300 mt-2"
                  onClick={() => handleDelete(product.id!)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}