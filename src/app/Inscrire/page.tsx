"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (existingUser) {
        setError("User with this email already exists.");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(`SignUp Error: ${signUpError.message}`);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("users").insert([
        { email, name, phone, address },
      ]);

      if (insertError) {
        setError(`User Insert Error: ${insertError.message}`);
        setLoading(false);
        return;
      }

      setSuccess("Sign up successful! Please check your email for verification.");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">S&apos;inscrire</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          required
        />
        <input
          type="password"
          placeholder="Mot de Passe"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
          required
        />
        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Name"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 border mb-4 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone"
          required
        />
        <input
          type="text"
          placeholder="Addresse"
          className="w-full p-2 border mb-4 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-label="Addresse"
          required
        />

        <button
          onClick={handleSignUp}
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-primary cursor-not-allowed" : "bg-secondary hover:bg-accent duration-200"
          }`}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "En cours..." : "S'inscrire"}
        </button>
      </div>
    </div>
  );
};

export default SignUp;