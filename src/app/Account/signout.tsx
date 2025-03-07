"use client";

import { useState , useEffect} from "react";
import { supabase } from "../../lib/supabase";
import { loadTranslations } from "@/utils/loadTranslations";

const SignOut = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [translations, setTranslations] = useState<{
    sign_out: {
      signing_out: string;
      sign_out: string;
    };
  }>({
    sign_out: {
      signing_out: "Signing Out...",
      sign_out: "Sign Out",
    },
  });

  useEffect(() => {
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);

  const handleSignOut = async () => {
    setIsDisabled(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isDisabled}
      className={`py-2 px-4 rounded ${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
      }`}
      style={{ transition: "none" }}
    >
      {isDisabled ? translations.sign_out.signing_out : translations.sign_out.sign_out}
    </button>
  );
};

export default SignOut;