"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ProductUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [fileInputs, setFileInputs] = useState<File[]>([]); // Store files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Add an initial file input when the component mounts
  useState(() => {
    setFileInputs([null]); // Initialize with one empty file input
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate input
      if (!title || !description || price === null || fileInputs.length === 0) {
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

      // Insert product data into the 'products' table
      const { error: insertError } = await supabase.from("products").insert([
        {
          title,
          description,
          price,
          image_urls: imageUrls,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess("Product uploaded successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setPrice(null);
      setFileInputs([null]); // Reset to one empty file input
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

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Upload Product</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          {fileInputs.map((file, index) => (
            <div key={index} className="mb-4">
              <input
                type="file"
                accept="image/*"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleImageUpload(e, index)}
                required={index === 0} // Only the first input is required
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
          className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-opacity duration-300 ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductUpload;