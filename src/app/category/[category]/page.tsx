"use client"; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

interface Product {
  id: number;
  title: string;
  price: number;
  image_urls: string[];
  colors?: string[]; // Add colors field
  created_at: string;
  category: string;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [decodedCategory, setDecodedCategory] = useState('');
  const [categoryData, setCategoryData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Unwrap the `params` Promise manually
    Promise.resolve(params).then((resolvedParams) => {
      const { category } = resolvedParams;

      // Decode the category name and replace hyphens with spaces
      const decoded = decodeURIComponent(category).replace(/-/g, ' ');
      setDecodedCategory(decoded);

      // Fetch category data from Supabase
      const fetchCategoryData = async () => {
        const { data, error } = await supabase
          .from('categories') // Replace with your table name
          .select('id, name, subcategories')
          .eq('name', decoded) // Match the category name
          .single(); // Expect a single result

        if (error || !data) {
          notFound(); // Show a 404 page if the category is not found
        }

        setCategoryData(data);
        setIsLoading(false);
      };

      fetchCategoryData();
    });
  }, [params]);

  useEffect(() => {
    if (categoryData) {
      // Fetch products by category
      const fetchProducts = async () => {
        const { data, error } = await supabase
          .from('products') // Replace with your products table name
          .select('*')
          .eq('category', categoryData.name); // Match the category name

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data || []);
        }
      };

      fetchProducts();
    }
  }, [categoryData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Category: {decodedCategory}
      </h1>

      {/* Display subcategories if they exist */}
      {categoryData.subcategories && categoryData.subcategories.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Subcategories</h2>
          <ul className="space-y-2">
            {categoryData.subcategories.map((subcategory: string, index: number) => (
              <li key={index}>
                <Link
                  href={`/category/${encodeURIComponent(
                    categoryData.name.replace(/\s+/g, '-')
                  )}/${encodeURIComponent(subcategory.replace(/\s+/g, '-'))}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {subcategory}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display products */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {products.length > 0 ? (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="border-b pb-4">
                <div className="flex items-center space-x-4">
                  {product.image_urls && product.image_urls.length > 0 && (
                    <img
                      src={product.image_urls[0]}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-gray-600">${product.price}</p>
                    {product.colors && (
                      <p className="text-sm text-gray-500">
                        Colors: {product.colors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No products found in this category.</p>
        )}
      </div>

      {/* Back button */}
      <div className="text-center mt-8">
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}