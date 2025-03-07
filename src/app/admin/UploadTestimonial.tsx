'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  stars: number;
  feedback: string;
}

interface FormData {
  id?: number;
  name: string;
  role: string;
  stars: number;
  feedback: string;
}

export default function ManageTestimonials() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    stars: 5,
    feedback: '',
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase.from('testimonials').select('*');
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des témoignages:', error);
      }
    };
    fetchTestimonials();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedId(testimonial.id);
    setFormData({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      stars: testimonial.stars,
      feedback: testimonial.feedback,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      alert('Témoignage supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Échec de la suppression du témoignage.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.feedback.trim()) {
      alert('Tous les champs sont requis.');
      return;
    }

    try {
      if (selectedId) {
        const { error } = await supabase.from('testimonials').update(formData).eq('id', selectedId);
        if (error) throw error;
        alert('Témoignage mis à jour avec succès !');
      } else {
        const { error } = await supabase.from('testimonials').insert([formData]);
        if (error) throw error;
        alert('Témoignage ajouté avec succès !');
      }
      setFormData({ name: '', role: '', stars: 5, feedback: '' });
      setSelectedId(null);
      const { data } = await supabase.from('testimonials').select('*');
      setTestimonials(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Échec du traitement du témoignage.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Gestion des avis clients</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rôle</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Étoiles</label>
          <input type="number" name="stars" value={formData.stars} onChange={handleChange} min="1" max="5" className="w-full p-2 border rounded focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Avis</label>
          <textarea name="feedback" value={formData.feedback} onChange={handleChange} rows={4} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500" required></textarea>
        </div>
        <button type="submit" className="bg-[#305eb8] text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full">
          {selectedId ? 'Mettre à jour' : 'Soumettre'}
        </button>
      </form>
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Avis existants</h3>
      {testimonials.length === 0 ? (
        <p className="text-center text-gray-500">Aucun avis disponible</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
              <p className="font-semibold text-lg">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
              <p className="italic mt-2">{testimonial.feedback}</p>
              <div className="flex gap-2 justify-center mt-4">
                <button onClick={() => handleEdit(testimonial)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition">Éditer</button>
                <button onClick={() => handleDelete(testimonial.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
