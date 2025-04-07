"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Testimonial {
  id: number;
  name: string;
  stars: number;
  feedback: string;
}

type FormData = Omit<Testimonial, "id"> & { id?: number };

interface SupabaseError {
  message: string;
}

export default function UploadTestimonial() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    stars: 1,
    feedback: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase.from("testimonials").select("*");
      if (error) throw new Error(error.message);
      setTestimonials(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle star rating change
  const handleStarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prevData) => ({
      ...prevData,
      stars: value,
    }));
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editMode && formData.id) {
        // Update existing testimonial
        const { error } = await supabase
          .from("testimonials")
          .update({
            name: formData.name,
            stars: formData.stars,
            feedback: formData.feedback,
          })
          .eq("id", formData.id);

        if (error) {
          throw error;
        }
      } else {
        // Insert new testimonial
        const { error } = await supabase.from("testimonials").insert([
          {
            name: formData.name,
            stars: formData.stars,
            feedback: formData.feedback,
          },
        ]);

        if (error) {
          throw error;
        }
      }

      setSuccess(true);
      setFormData({ name: "", stars: 1, feedback: "" });
      setEditMode(false);
      fetchTestimonials();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Edit a testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a testimonial
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      fetchTestimonials();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-[#305eb8] mb-6">
        Ajouter avis d&apos;un client
      </h2>

      {success && (
        <div className="text-green-500 text-center mb-4">
          Ajouté avec succès
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4">
          Erreur: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Etoiles</label>
          <input
            type="number"
            id="stars"
            name="stars"
            value={formData.stars}
            onChange={handleStarChange}
            min="1"
            max="5"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
            Avis
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? "bg-gray-400" : "bg-[#305eb8] hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? "Submitting..." : editMode ? "Update" : "Submit"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center text-[#305eb8] mb-4">
          Avis clients précédents
        </h3>
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500">Pas d&apos;avis.</p>
        ) : (
          <ul className="space-y-4">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-yellow-500">
                      {"⭐".repeat(testimonial.stars)}
                    </p>
                    <p className="text-gray-700 mt-2">{testimonial.feedback}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}