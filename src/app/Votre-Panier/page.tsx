"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Image from "next/image";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_urls: string[];
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(""); // State for name
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // State for phone number
  const [address, setAddress] = useState<string>(""); // State for address
  const [formError, setFormError] = useState<string>(""); // State for form validation errors

  // Fetch cart items from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    updateCartInLocalStorage(updatedCart);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    updateCartInLocalStorage(updatedCart);
  };

  // Update cart in localStorage
  const updateCartInLocalStorage = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = 8;
  const finalPrice = totalPrice + deliveryFee;

  // Handle form submission
  const handleConfirmationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !phoneNumber || !address) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }

    // Clear any previous errors
    setFormError("");

    // Simulate payment processing
    setIsPaymentLoading(true);
    setTimeout(() => {
      setIsPaymentLoading(false);
      alert("Commande confirmée avec succès!");
      localStorage.removeItem("cart"); // Clear the cart
      setCartItems([]); // Clear the cart items in state
      setName(""); // Reset name field
      setPhoneNumber(""); // Reset phone number field
      setAddress(""); // Reset address field
    }, 2000);
  };

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 md:pt-48 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 my-10 text-center">
          Votre Panier
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-primary p-6 text-center">
            <p className="text-xl text-gray-600 py-5">Votre panier est vide.</p>
            <Link
              href="/"
              className="mt-4 px-6 py-2 bg-secondary/85 text-white rounded hover:bg-secondary transition"
            >
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="bg-primary p-6">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4"
                >
                  <div className="w-full sm:w-1/4 lg:w-1/5 aspect-square relative">
                    <Image
                      src={item.image_urls[0] || "/default-image.png"}
                      alt={item.title}
                      height={200}
                      width={200}
                      unoptimized
                      className="object-cover mx-auto md:mx-0"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                    <p className="text-gray-600">Prix: {item.price} Dt</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                    />
                    <div className="text-lg font-semibold text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} Dt
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 text-sm"
                      aria-label="Remove item"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center text-lg font-semibold text-gray-800">
              <h2>Totale</h2>
              <p>{totalPrice.toFixed(2)} Dt</p>
            </div>

            <div className="mt-2 flex justify-between items-center text-lg font-semibold text-gray-800">
              <h2>Frais de livraison</h2>
              <p>{deliveryFee} Dt</p>
            </div>

            <div className="mt-6 flex justify-between items-center text-lg font-semibold text-gray-800">
              <h2>Finale totale</h2>
              <p>{finalPrice.toFixed(2)} Dt</p>
            </div>

            {/* Confirmation Form (Always Visible) */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Informations de livraison
              </h2>
              {formError && (
                <p className="text-red-500 text-sm mb-4">{formError}</p>
              )}
              <form onSubmit={handleConfirmationSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-accent transition-colors duration-300 ${
                    isPaymentLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? "Traitement en cours..." : "Confirmer la commande"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;