import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";

const CHECKOUT_URL = "https://cosmofeed.com/vp/64297b5ed83e0200209d5a3c";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-primary" />
              Your Cart
              <span className="text-muted-foreground text-xl">({totalItems} items)</span>
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any products yet.
              </p>
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-card/80 backdrop-blur border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.legacyId}`} className="shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted/50 border border-border">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.legacyId}`}>
                        <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{item.category}</p>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(item.salePrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.regularPrice)}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium text-lg">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right mt-2 text-sm text-muted-foreground">
                        Subtotal: <span className="font-semibold text-foreground">{formatPrice(item.salePrice * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-28 bg-card/80 backdrop-blur border border-border rounded-xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({totalItems})</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-primary">Instant (Digital)</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <a
                    href={CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2 btn-glow" size="lg">
                      Proceed to Checkout <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>

                  <p className="text-xs text-muted-foreground text-center">
                    You will be redirected to our secure payment partner
                  </p>

                  <Link to="/products" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
