"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");
  const [editedSubcategories, setEditedSubcategories] = useState<string[]>([]);

  const validateInput = (input: string): boolean => {
    return !input.includes("-");
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      const transformedData = data?.map((category) => ({
        ...category,
        subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
      }));

      setCategories(transformedData || []);
    } catch (err) {
      setError(err instanceof Error ? `Error fetching categories: ${err.message}` : "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addSubcategory = () => {
    const trimmedSub = newSubcategory.trim();
    if (!trimmedSub) return;
    
    if (!validateInput(trimmedSub)) {
      setError("Les sous-catégories ne peuvent pas contenir de tirets (-)");
      return;
    }

    setSubcategories((prev) => [...prev, trimmedSub]);
    setNewSubcategory("");
    setError("");
  };

  const removeSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubcategory = (index: number, value: string) => {
    if (!validateInput(value)) {
      alert("Les sous-catégories ne peuvent pas contenir de tirets (-)");
      return;
    }
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index] = value;
    setSubcategories(updatedSubcategories);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName) {
      alert("Le nom de la catégorie est obligatoire.");
      return;
    }

    if (!validateInput(categoryName)) {
      alert("Le nom de la catégorie ne peut pas contenir de tirets (-)");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: categoryName, subcategories }]);

      if (error) throw error;

      setSuccessMessage("Catégorie ajoutée avec succès!");
      setCategoryName("");
      setSubcategories([]);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchCategories();
      setSuccessMessage("Catégorie supprimée avec succès!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditedCategoryName(category.name);
    setEditedSubcategories([...category.subcategories]);
    setError("");
  };

  const saveEditedCategory = async (id: number) => {
    if (!validateInput(editedCategoryName)) {
      alert("Le nom de la catégorie ne peut pas contenir de tirets (-)");
      return;
    }

    for (const sub of editedSubcategories) {
      if (!validateInput(sub)) {
        alert("Les sous-catégories ne peuvent pas contenir de tirets (-)");
        return;
      }
    }

    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: editedCategoryName, subcategories: editedSubcategories })
        .eq("id", id);

      if (error) throw error;

      await fetchCategories();
      setEditingCategoryId(null);
      setSuccessMessage("Catégorie mise à jour avec succès!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
    }
  };

  const addEditedSubcategory = () => {
    setEditedSubcategories((prev) => [...prev, ""]);
  };

  const removeEditedSubcategory = (index: number) => {
    setEditedSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEditedSubcategory = (index: number, value: string) => {
    if (!validateInput(value)) {
      alert("Les sous-catégories ne peuvent pas contenir de tirets (-)");
      return;
    }
    const updatedSubcategories = [...editedSubcategories];
    updatedSubcategories[index] = value;
    setEditedSubcategories(updatedSubcategories);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gérer les Catégories</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une Catégorie</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégories</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Entrez une sous-catégorie (pas de tirets)"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newSubcategory}
              onChange={(e) => {
                setNewSubcategory(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              onClick={addSubcategory}
            >
              Ajouter
            </button>
          </div>
          
          {subcategories.map((subcategory, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Sous-catégorie (pas de tirets)"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={subcategory}
                onChange={(e) => updateSubcategory(index, e.target.value)}
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

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Catégories Existantes</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600">Aucune catégorie trouvée.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                {editingCategoryId === category.id ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => {
                        setEditedCategoryName(e.target.value);
                        setError("");
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                    <div className="mt-2 space-y-2">
                      {editedSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg">
                          <input
                            type="text"
                            value={subcategory}
                            onChange={(e) => updateEditedSubcategory(index, e.target.value)}
                            className="flex-1 bg-transparent focus:outline-none"
                            placeholder="Sous-catégorie (pas de tirets)"
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
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    {category.subcategories.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {category.subcategories.map((subcategory, index) => (
                          <li key={index}>- {subcategory}</li>
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