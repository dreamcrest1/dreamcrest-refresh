import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, LogOut, Edit2, Check, X, Clock, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { useAuth } from "@/providers/AuthProvider";
import { getProfile, updateProfile, Profile } from "@/lib/db/profiles";
import { getUserOrders, Order } from "@/lib/db/orders";
import { formatPrice } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Account() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [profileData, ordersData] = await Promise.all([
      getProfile(user.id),
      getUserOrders(user.id),
    ]);

    setProfile(profileData);
    setOrders(ordersData);
    if (profileData?.full_name) {
      setEditName(profileData.full_name);
    }
  };

  const handleSaveName = async () => {
    if (!user || !editName.trim()) return;

    setIsSaving(true);
    const updated = await updateProfile(user.id, { full_name: editName.trim() });
    setIsSaving(false);

    if (updated) {
      setProfile(updated);
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your name has been saved." });
    } else {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-48"
                        placeholder="Your name"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveName}
                        disabled={isSaving}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(profile?.full_name || "");
                        }}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {profile?.full_name || "Guest User"}
                      </h2>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-8 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your order history will appear here after your first purchase.
                </p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card/80 backdrop-blur border border-border rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <span className="font-bold text-primary">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-sm truncate max-w-[150px]">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
