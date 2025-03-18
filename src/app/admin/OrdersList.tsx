"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

interface Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: string; // JSON string of cart items
  total_price: number;
  created_at: string;
}

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }); // Sort by most recent orders

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders List</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Order #{order.id}
              </h3>
            </div>
            <p className="text-gray-600">
              <strong>Name:</strong> {order.name}
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> {order.phone}
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> {order.address}
            </p>
            <p className="text-gray-600">
              <strong>Total Price:</strong> {order.total_price} Dt
            </p>
            <p className="text-gray-600">
              <strong>Order Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800">Items:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {JSON.parse(order.items).map((item: any, index: number) => (
                  <li key={index}>
                    {item.title} - {item.quantity} x {item.price} Dt
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;