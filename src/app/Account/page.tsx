"use client";

import { useAuth } from "@/lib/useAuth";
import SignOut from "./signout";
import Navbar from "../Navbar";
import Link from "next/link";
import Footer from "../Footer";
import FormPage from "./Form";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Dashboard = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("name")
          .eq("email", user.email)
          .single();

        if (error) throw error;

        if (data?.name) {
          const nameParts = data.name.split(" ");
          setFirstName(nameParts[0]);
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    };

    fetchUserName();
  }, [user]);

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <main className="container mx-auto md:pt-48 pt-20">
        {user ? (
          <div className="bg-primary p-3 md:p-8">
            <div className="md:flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {firstName || "User"}!
              </h2>
              <SignOut />
            </div>
            <div>
              <FormPage />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">
              Veuillez vous connecter pour accéder à votre compte.
            </p>
            <div className="space-x-4">
              <Link
                href="/Se-Connecter"
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-accent transition"
              >
                Se Connecter
              </Link>
              <Link
                href="/Inscrire" // Fixed href value
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Se inscrire
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;