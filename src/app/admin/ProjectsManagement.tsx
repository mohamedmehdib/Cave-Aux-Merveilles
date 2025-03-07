"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Project {
  id: number;
  image_url: string;
}

const ProjectsManagement = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });
      if (error) {
        throw error;
      }
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setErrorMessage("Error fetching projects.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    if (!imageFile) {
      setErrorMessage("Please select an image file.");
      setLoading(false);
      return;
    }
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(`projects/${Date.now()}_${imageFile.name}`, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) {
        console.error("Upload Error:", uploadError);
        setErrorMessage("Error uploading image: " + uploadError.message);
        setLoading(false);
        return;
      }
      console.log("Upload Success:", uploadData);

      const { data: publicURLData } = supabase.storage
        .from("project-images")
        .getPublicUrl(uploadData.path);
      const publicURL = publicURLData.publicUrl;
      console.log("Public URL Data:", publicURLData);
      console.log("Public URL:", publicURL);
      if (!publicURL) {
        setErrorMessage("Public URL is empty.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("projects")
        .insert([{ image_url: publicURL }]);
      if (insertError) {
        setErrorMessage("Error adding project: " + insertError.message);
      } else {
        setSuccessMessage("Project added successfully!");
      }

      setImageFile(null);
      fetchProjects();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
      if (error) {
        throw error;
      }
      setSuccessMessage("Project deleted successfully!");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setErrorMessage("Error deleting project.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Gérer les projets
      </h2>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleProjectSubmit} className="space-y-4">
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="imageFile"
          >
            Image du projet
          </label>
          <input
            type="file"
            id="imageFile"
            className="w-full p-2 sm:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-opacity duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Sauvegarde du projet..." : "Sauvegarder le projet"}
        </button>
      </form>
      <div className="mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Liste des projets
        </h3>
        {projects.length === 0 ? (
          <p className="text-gray-600">Aucun projet trouvé.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-sm"
              >
                <div className="w-full sm:w-auto">
                  <Image
                    width={500}
                    height={500}
                    src={project.image_url}
                    alt={`Project ${project.id}`}
                    className="w-full sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                </div>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement;