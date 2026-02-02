import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import type { Json } from "@/integrations/supabase/types";

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  checkout_url: string | null;
  created_at: string;
}

export async function createOrder(
  userId: string,
  items: CartItem[],
  totalAmount: number,
  checkoutUrl?: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        items: JSON.parse(JSON.stringify(items)) as Json,
        total_amount: totalAmount,
        checkout_url: checkoutUrl || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    return null;
  }

  return {
    ...data,
    items: data.items as unknown as CartItem[],
  };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data.map((order) => ({
    ...order,
    items: order.items as unknown as CartItem[],
  }));
}
