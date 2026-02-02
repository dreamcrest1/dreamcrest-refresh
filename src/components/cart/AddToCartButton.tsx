import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export function AddToCartButton({
  product,
  variant = "secondary",
  size = "sm",
  className,
  showText = true,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Button
      variant={inCart ? "outline" : variant}
      size={size}
      className={cn(
        "gap-1.5 transition-all",
        inCart && "border-primary text-primary",
        className
      )}
      onClick={handleClick}
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4" />
          {showText && "In Cart"}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {showText && "Add to Cart"}
        </>
      )}
    </Button>
  );
}
