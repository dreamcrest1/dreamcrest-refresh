import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";

const CHECKOUT_URL = "https://cosmofeed.com/vp/64297b5ed83e0200209d5a3c";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const navigateTo = (path: string) => {
    closeDrawer();
    // Fallback navigation to avoid Router context issues inside the drawer.
    window.location.assign(path);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 z-[90] h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Your Cart ({totalItems})</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDrawer}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mb-4">Add some products to get started!</p>
                  <Button onClick={() => navigateTo("/products")}>Browse Products</Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-3 p-3 bg-muted/50 rounded-lg border border-border"
                  >
                    {/* Image */}
                    <a
                      href={`/product/${item.legacyId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(`/product/${item.legacyId}`);
                      }}
                      className="shrink-0"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    </a>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/product/${item.legacyId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(`/product/${item.legacyId}`);
                        }}
                        className="block"
                      >
                        <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(item.salePrice)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="grid gap-2">
                  <a
                    href={CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2 btn-glow" size="lg">
                      Checkout <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => navigateTo("/cart")}
                  >
                    View Full Cart
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
