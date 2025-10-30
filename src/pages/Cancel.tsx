import { Link } from "react-router-dom";
import LlamaNav from "@/components/LlamaNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-background">
      <LlamaNav />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center">
            <div className="mb-8">
              <XCircle className="w-24 h-24 mx-auto text-orange-400" />
            </div>
            
            <div className="text-6xl mb-6 animate-wiggle">🦙</div>
            
            <h1 className="text-4xl font-heading font-bold mb-4">
              Checkout <span className="text-primary">Cancelled</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              No worries! Your payment was not processed.
            </p>

            <Card className="bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-950/20 dark:to-yellow-950/20 p-6 mb-8 border border-orange-100/50 dark:border-orange-900/30">
              <p className="text-sm flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">🦙</span>
                <span className="italic text-foreground">
                  "That's okay! Take your time to think about it. I'll be here whenever you're ready to plan your amazing adventure. No pressure at all! —Lleonard"
                </span>
              </p>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">What would you like to do next?</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Browse Destinations
                  </Button>
                </Link>
                <Link to="/plan" className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    Try Subscription Again
                  </Button>
                </Link>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Have questions? We're here to help! Feel free to explore more about LlamaTrip.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cancel;

