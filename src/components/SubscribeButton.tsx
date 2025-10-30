import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubscribeButtonProps {
  priceId: string;
  variant?: "default" | "hero" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const SubscribeButton = ({ 
  priceId, 
  variant = "hero", 
  size = "lg",
  className = "",
  children 
}: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    
    try {
      // Call your backend to create a checkout session
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || "Subscribe Now"}
        </>
      )}
    </Button>
  );
};

export default SubscribeButton;

