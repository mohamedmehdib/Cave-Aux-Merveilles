"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

interface CartItem {
  title: string;
  quantity: number;
  price: number;
}

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
      // Type-check the error object
      if (error instanceof Error) {
        console.error("Error fetching orders:", error.message);
        setError("Failed to fetch orders. Please try again later.");
      } else {
        console.error("An unknown error occurred:", error);
        setError("An unknown error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const { error } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);

        if (error) {
          throw error;
        }

        // Remove the order from the local state
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error deleting order:", error.message);
          setError("Failed to delete order. Please try again later.");
        } else {
          console.error("An unknown error occurred:", error);
          setError("An unknown error occurred. Please try again later.");
        }
      }
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-600">No orders found.</p>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Orders List</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Order #{order.id}
              </h3>
              <p className="text-gray-600 sm:text-right">
                <strong>Order Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <strong>Name:</strong> {order.name}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {order.phone}
              </p>
              <p className="text-gray-600 col-span-2">
                <strong>Address:</strong> {order.address}
              </p>
              <p className="text-gray-600">
                <strong>Total Price:</strong> {order.total_price} Dt
              </p>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Items:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {JSON.parse(order.items).map((item: CartItem, index: number) => (
                  <li key={index}>
                    {item.title} - {item.quantity} x {item.price} Dt
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => deleteOrder(order.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;