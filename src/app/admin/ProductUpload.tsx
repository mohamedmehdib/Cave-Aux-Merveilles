"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Product {
  id?: number;
  title: string;
  price: number;
  description: string;
  image_urls: string[];
  colors?: string[];
  category?: string;
  subcategory?: string;
  created_at?: string;
  status?: boolean; // true = en stock, false = rupture de stock
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sortBy] = useState("recent");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [fileInputs, setFileInputs] = useState<(File | null)[]>([null]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ name: string; subcategories: string[] }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true); // Default to "en stock"
  const formRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) {
          throw error;
        }
        setCategories(data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching categories.");
        }
      }
    };
    fetchCategories();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
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
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      case "oldest":
        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
      default:
        return 0;
    }
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.price);
    setDescription(product.description);
    setColors(product.colors || []);
    setExistingImageUrls(product.image_urls || []);
    setFileInputs([null]);
    setSelectedCategory(product.category || "");
    setSelectedSubcategory(product.subcategory || "");
    setStatus(product.status ?? true); // Set status with fallback to true
    setError("");
    setSuccess("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!title || price === null || !description || (fileInputs.length === 0 && existingImageUrls.length === 0)) {
        setError("Please fill out all fields and upload at least one image.");
        return;
      }
      const validColors = colors.filter((color) => color.trim() !== "");
      if (validColors.length !== colors.length) {
        alert("Please ensure all color fields are filled out.");
        return;
      }
      const validFiles = fileInputs.filter((file) => file !== null) as File[];
      const newImageUrls = await Promise.all(
        validFiles.map(async (file) => {
          const filePath = `products/${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(filePath, file);
          if (error) {
            throw error;
          }
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);
          return urlData.publicUrl;
        })
      );
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            title,
            price,
            description,
            image_urls: allImageUrls,
            colors: validColors.length > 0 ? validColors : null,
            category: selectedCategory || null,
            subcategory: selectedSubcategory || null,
            status: status,
          })
          .eq("id", editingProduct.id);
        if (error) {
          throw error;
        }
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === editingProduct.id
              ? { ...p, title, price, description, image_urls: allImageUrls, colors: validColors, category: selectedCategory, subcategory: selectedSubcategory, status }
              : p
          )
        );
        setSuccess("Product updated successfully!");
      } else {
        const { error } = await supabase.from("products").insert([
          {
            title,
            price,
            description,
            image_urls: allImageUrls,
            colors: validColors.length > 0 ? validColors : null,
            category: selectedCategory || null,
            subcategory: selectedSubcategory || null,
            created_at: new Date().toISOString(),
            status: status, // Use the status state which defaults to true
          },
        ]);
        if (error) {
          throw error;
        }
        const { data } = await supabase.from("products").select("*");
        setProducts(data || []);
        setSuccess("Product added successfully!");
      }
      setTitle("");
      setPrice(null);
      setDescription("");
      setColors([]);
      setFileInputs([null]);
      setExistingImageUrls([]);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setStatus(true); // Reset to "en stock" after submission
      setEditingProduct(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = [...fileInputs];
      newFiles[index] = e.target.files[0];
      setFileInputs(newFiles);
      if (index === fileInputs.length - 1) {
        setFileInputs([...newFiles, null]);
      }
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newColors = [...colors];
    newColors[index] = e.target.value;
    setColors(newColors);
  };

  const addColorField = () => {
    if (colors.length > 0 && colors[colors.length - 1].trim() === "") {
      alert("Please fill out the current color field before adding a new one.");
      return;
    }
    setColors([...colors, ""]);
  };

  const removeColorField = (index: number) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };

  const removeExistingImage = (index: number) => {
    const newImageUrls = [...existingImageUrls];
    newImageUrls.splice(index, 1);
    setExistingImageUrls(newImageUrls);
  };

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
      <div className="min-h-screen py-8 px-4 sm:px-8">
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
      <div className="min-h-screen py-8 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Magasin</h1>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Magasin</h1>
      {success && (
        <div className="text-center text-green-500 text-sm mb-4">{success}</div>
      )}
      <div ref={formRef} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          {editingProduct ? "Modifier Produit" : "Ajouter un produit"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              placeholder="Titre du produit"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
            <input
              type="number"
              placeholder="Prix du produit"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={price ?? ""}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Description du produit"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleurs</label>
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Entrez une couleur"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={color}
                  onChange={(e) => handleColorChange(e, index)}
                  required
                />
                <button
                  type="button"
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  onClick={() => removeColorField(index)}
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
              onClick={addColorField}
            >
              Ajouter Couleur
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
            <select
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sous categorie</label>
              <select
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                <option value="">Sélectionnez une sous-catégorie</option>
                {categories
                  .find((category) => category.name === selectedCategory)
                  ?.subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            {existingImageUrls.map((imageUrl, index) => (
              <div key={index} className="mb-4 flex items-center gap-2">
                <Image
                  src={imageUrl}
                  alt={`Existing Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg"
                  unoptimized
                />
                <button
                  type="button"
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  onClick={() => removeExistingImage(index)}
                >
                  Supprimer
                </button>
              </div>
            ))}
            {fileInputs.map((file, index) => (
              <div key={index} className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => handleImageUpload(e, index)}
                  required={index === 0 && !editingProduct}
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Fichier sélectionné: {file.name}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-500"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
              <span className="text-gray-700">
                {status ? "En stock" : "Rupture de stock"}
              </span>
            </div>
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
                ? "Mise à jour..."
                : "Téléchargement..."
              : editingProduct
              ? "Modifier Produit"
              : "Ajouter un produit"}
          </button>
          {editingProduct && (
            <button
              type="button"
              className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-lg hover:bg-gray-600 transition-colors duration-300"
              onClick={() => {
                setEditingProduct(null);
                setTitle("");
                setPrice(null);
                setDescription("");
                setColors([]);
                setFileInputs([null]);
                setExistingImageUrls([]);
                setSelectedCategory("");
                setSelectedSubcategory("");
                setStatus(true); // Reset to "en stock" when canceling edit
              }}
            >
              Annuler la modification
            </button>
          )}
        </form>
      </div>
      {sortedProducts.length === 0 ? (
        <div className="text-center text-accent">Aucun produit disponible.</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group hover:bg-white overflow-hidden hover:shadow-lg transition-all duration-300 relative w-72 flex flex-col"
            >
              <div className="relative w-full h-72 flex items-center justify-center pt-4">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: `.swiper-button-next-${product.id}`,
                    prevEl: `.swiper-button-prev-${product.id}`,
                  }}
                  loop={true}
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
                          unoptimized
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
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
              <div className="p-4 text-center flex-grow">
                <h2 className="text-xl font-semibold text-accent mb-2">{product.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                {product.category && (
                  <p className="text-sm text-gray-600">
                    Category: {product.category}
                    {product.subcategory && ` > ${product.subcategory}`}
                  </p>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                )}
                <p>
                  <span className="text-xs text-gray-600">À partir de </span>
                  <span className="font-bold text-gray-700">{product.price.toFixed(2)} Dt</span>
                </p>
                <p className="text-sm text-gray-600">
                  Statut: {product.status ? "En stock" : "Rupture de stock"}
                </p>
              </div>
              <div className="p-4">
                <button
                  className="w-full py-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleEdit(product)}
                >
                  Modifier
                </button>
                <button
                  className="w-full py-2 bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-300 mt-2"
                  onClick={() => handleDelete(product.id!)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}