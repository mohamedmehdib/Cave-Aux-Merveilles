'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function MessagesList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);

      if (error) {
        throw error;
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );

      alert('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        Messages Reçus
      </h2>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500">Aucun message trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Nom</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Objet</th>
                <th className="py-2 px-4 border-b text-left">Message</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{message.name}</td>
                  <td className="py-2 px-4 border-b">{message.email}</td>
                  <td className="py-2 px-4 border-b">{message.subject}</td>
                  <td className="py-2 px-4 border-b">{message.message}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(message.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="bg-red-500 hover:bg-red-600 text-white duration-200 p-2 rounded-lg"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}