import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import LlamaNav from "@/components/LlamaNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface SessionData {
  status: string;
  customer_email: string;
  amount_total: number;
  currency: string;
}

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/checkout-session/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to retrieve session');
        }
        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <LlamaNav />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          {loading && (
            <Card className="p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">
                Confirming your subscription...
              </p>
            </Card>
          )}

          {error && (
            <Card className="p-12 text-center border-destructive">
              <div className="text-6xl mb-6">😕</div>
              <h1 className="text-3xl font-heading font-bold mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {error}
              </p>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Return Home
                </Button>
              </Link>
            </Card>
          )}

          {!loading && !error && sessionData && (
            <Card className="p-12 text-center shadow-glow">
              <div className="mb-8 animate-bounce-gentle">
                <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
              </div>
              
              <div className="text-6xl mb-6 animate-wiggle">🦙✨</div>
              
              <h1 className="text-4xl font-heading font-bold mb-4">
                Welcome to <span className="text-primary">LlamaTrip!</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Your subscription is confirmed! Lleonard is excited to help you plan amazing adventures.
              </p>

              <Card className="bg-accent/10 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{sessionData.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      ${(sessionData.amount_total / 100).toFixed(2)} {sessionData.currency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing:</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                </div>
              </Card>

              <div className="bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-2xl p-6 mb-8 border border-orange-100/50 dark:border-orange-900/30">
                <p className="text-sm flex items-start gap-2">
                  <span className="text-2xl flex-shrink-0">🦙</span>
                  <span className="italic text-foreground">
                    "A confirmation email is on its way to you! Now, let's start planning your dream trip together. I promise to make it fun and unforgettable! —Lleonard"
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/plan">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Start Planning Your Trip
                  </Button>
                </Link>
                <Link to="/itinerary">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View My Itinerary
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;

