"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductUpload from "./ProductUpload";
import OrdersList from "./OrdersList";
import UploadCategory from "./UploadCategory";
import UploadTestimonial from "./UploadTestimonials";

const AdminDashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeComponent, setActiveComponent] = useState("ProductUpload");

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from("admin")
        .select("*")
        .eq("email", email)
        .single();

      if (adminError || !adminData) {
        setError("Admin account does not exist");
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r bg-primary">
        <div className="p-6 sm:p-8 bg-white shadow-xl rounded-lg w-full max-w-md space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4">Admin Sign In</h2>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignIn}
            className={`w-full py-3 bg-accent text-white rounded-lg font-semibold shadow-lg transition-opacity duration-300 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">Admin Dashboard</h1>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 sm:mb-12">
        <button
          onClick={() => setActiveComponent("ProductUpload")}
          className={`px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-md transition-colors duration-300 ${
            activeComponent === "ProductUpload" ? "bg-accent text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Produits
        </button>
        <button
          onClick={() => setActiveComponent("OrdersList")}
          className={`px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-md transition-colors duration-300 ${
            activeComponent === "OrdersList" ? "bg-accent text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Commandes
        </button>
        <button
          onClick={() => setActiveComponent("Categories")}
          className={`px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-md transition-colors duration-300 ${
            activeComponent === "Categories" ? "bg-accent text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveComponent("AvisClients")}
          className={`px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-md transition-colors duration-300 ${
            activeComponent === "AvisClients" ? "bg-accent text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Avis Clients
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg mx-auto max-w-4xl">
        {activeComponent === "ProductUpload" && <ProductUpload />}
        {activeComponent === "OrdersList" && <OrdersList />}
        {activeComponent === "Categories" && <UploadCategory />}
        {activeComponent === "AvisClients" && <UploadTestimonial />}
      </div>
    </div>
  );
};

export default AdminDashboard;