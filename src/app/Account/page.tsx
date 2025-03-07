"use client";

import { useAuth } from "@/lib/useAuth";
import SignOut from "./signout";
import Navbar from "../Navbar";
import Link from "next/link";
import Footer from "../Footer";
import FormPage from "./Form";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { loadTranslations } from "@/utils/loadTranslations";

const Dashboard = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [translations, setTranslations] = useState<{
    dashboard: {
      heading: string;
      welcome: string;
      login_prompt: string;
      sign_in: string;
      sign_up: string;
    };
  }>({
    dashboard: {
      heading: "My Account",
      welcome: "Welcome, {firstName} !",
      login_prompt: "Please log in to access your account.",
      sign_in: "Sign In",
      sign_up: "Sign Up",
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);

    const fetchUserName = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("name")
            .eq("email", user.email)
            .single();

          if (error) {
            console.error("Error fetching user data:", error.message);
            return;
          }

          if (data?.name) {
            const nameParts = data.name.split(" ");
            setFirstName(nameParts[0]);
          }
        } catch (err) {
          console.error("Error fetching user name:", err);
        }
      }
    };

    fetchUserName();
  }, [user]);

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar />
      <div className="h-[60vh] flex justify-center items-center bg-[#274e9d]">
        <div className="text-center">
          <h1 className={`text-6xl text-white font-medium`}>
            {translations.dashboard.heading}
          </h1>
          <hr className="w-1/4 mx-auto border-2 border-white mt-4" />
        </div>
      </div>

      <main className="container mx-auto p-2 md:p-6">
        {user ? (
          <div className="bg-white p-3 md:p-8 rounded-lg md:shadow-xl">
            <div className="md:flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {translations.dashboard.welcome.replace(
                  "{firstName}",
                  firstName || "User"
                )}
              </h2>
              <SignOut />
            </div>
            <div>
              <FormPage />
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-lg text-gray-600 mb-4">
              {translations.dashboard.login_prompt}
            </p>
            <div className="space-x-4">
              <Link
                href="/SignIn"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {translations.dashboard.sign_in}
              </Link>
              <Link
                href="/SignUp"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                {translations.dashboard.sign_up}
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