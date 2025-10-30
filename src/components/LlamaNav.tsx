import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const LlamaNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-3xl animate-wiggle group-hover:animate-bounce-gentle">
              🦙
            </div>
            <div>
              <h1 className="text-2xl font-heading font-semibold text-primary">
                LlamaTrip
              </h1>
              <p className="text-xs text-muted-foreground">by Llama, Inc.</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
              >
                Home
              </Button>
            </Link>
            <Link to="/plan">
              <Button
                variant={isActive("/plan") ? "default" : "ghost"}
                size="sm"
              >
                Plan Trip
              </Button>
            </Link>
            <Link to="/itinerary">
              <Button
                variant={isActive("/itinerary") ? "default" : "ghost"}
                size="sm"
              >
                My Itinerary
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LlamaNav;
