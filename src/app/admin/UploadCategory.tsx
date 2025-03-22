"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

interface Category {
  id: number;
  name: string;
  subcategories: string[]; // Always an array
}

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]); // Existing categories
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null); // Track which category is being edited
  const [editedCategoryName, setEditedCategoryName] = useState<string>(""); // Edited category name
  const [editedSubcategories, setEditedSubcategories] = useState<string[]>([]); // Edited subcategories

  // Fetch existing categories on component mount
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }

      // Ensure `subcategories` is always an array
      const transformedData = data?.map((category) => ({
        ...category,
        subcategories: Array.isArray(category.subcategories)
          ? category.subcategories
          : [], // Default to an empty array
      }));

      setCategories(transformedData || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Erreur lors de la récupération des catégories: ${err.message}`);
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a subcategory to the list
  const addSubcategory = () => {
    if (newSubcategory.trim() === "") return; // Don't add empty subcategories
    setSubcategories((prev) => [...prev, newSubcategory.trim()]); // Add the new subcategory
    setNewSubcategory(""); // Clear the input field
  };

  // Remove a subcategory from the list
  const removeSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a subcategory in the "Add Category" form
  const updateSubcategory = (index: number, value: string) => {
    const updatedSubcategories = [...subcategories]; // Create a copy of the subcategories array
    updatedSubcategories[index] = value; // Update the specific subcategory
    setSubcategories(updatedSubcategories); // Update the state
  };

  // Handle form submission for adding a new category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase
        .from("categories")
        .insert([
          {
            name: categoryName,
            subcategories: subcategories,
          },
        ]);

      if (error) {
        throw new Error("Erreur lors de l'ajout de la catégorie.");
      }

      setSuccessMessage("Catégorie ajoutée avec succès!");
      setCategoryName("");
      setSubcategories([]);
      await fetchCategories();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a category
  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      await fetchCategories();
      setSuccessMessage("Catégorie supprimée avec succès!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
    }
  };

  // Start editing a category
  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditedCategoryName(category.name);
    setEditedSubcategories([...category.subcategories]);
  };

  // Save edited category
  const saveEditedCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editedCategoryName,
          subcategories: editedSubcategories,
        })
        .eq("id", id);

      if (error) {
        throw new Error("Erreur lors de la mise à jour de la catégorie.");
      }

      await fetchCategories();
      setEditingCategoryId(null);
      setSuccessMessage("Catégorie mise à jour avec succès!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
    }
  };

  // Add a new subcategory to the edited category
  const addEditedSubcategory = () => {
    setEditedSubcategories((prev) => [...prev, ""]);
  };

  // Remove a subcategory from the edited category
  const removeEditedSubcategory = (index: number) => {
    setEditedSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a subcategory in the edited category
  const updateEditedSubcategory = (index: number, value: string) => {
    const updatedSubcategories = [...editedSubcategories];
    updatedSubcategories[index] = value;
    setEditedSubcategories(updatedSubcategories);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gérer les Catégories</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Success Message */}
      {successMessage && (
        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
      )}

      {/* Form to Add a New Category */}
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ajouter une Catégorie
        </h2>
        {/* Category Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nom de la catégorie
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        {/* Subcategories */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-catégories
          </label>
          {/* Input for adding a new subcategory */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Entrez une sous-catégorie"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              onClick={addSubcategory}
            >
              Ajouter
            </button>
          </div>
          {/* Display existing subcategories */}
          {subcategories.map((subcategory, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Entrez une sous-catégorie"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={subcategory}
                onChange={(e) => updateSubcategory(index, e.target.value)} // Use updateSubcategory
                required
              />
              <button
                type="button"
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                onClick={() => removeSubcategory(index)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-accent transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Traitement en cours..." : "Ajouter la catégorie"}
        </button>
      </form>

      {/* Display Existing Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Catégories Existantes
        </h2>
        {categories.length === 0 ? (
          <p className="text-gray-600">Aucune catégorie trouvée.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                {editingCategoryId === category.id ? (
                  // Edit Mode
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                    <div className="mt-2 space-y-2">
                      {editedSubcategories.map((subcategory, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
                        >
                          <input
                            type="text"
                            value={subcategory}
                            onChange={(e) =>
                              updateEditedSubcategory(index, e.target.value)
                            }
                            className="flex-1 bg-transparent focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeEditedSubcategory(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEditedSubcategory}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors duration-300"
                      >
                        Ajouter une sous-catégorie
                      </button>
                    </div>
                    <button
                      onClick={() => saveEditedCategory(category.id)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Enregistrer
                    </button>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    {category.subcategories.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {category.subcategories.map((subcategory, index) => (
                          <li key={index}>
                            - {subcategory}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  {editingCategoryId === category.id ? (
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                    >
                      Annuler
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditingCategory(category)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      Modifier
                    </button>
                  )}
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCategory;