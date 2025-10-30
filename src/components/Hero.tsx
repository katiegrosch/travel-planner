import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Sparkles } from "lucide-react";
import heroLlama from "@/assets/hero-llama.png";

const Hero = () => {
  return (
    <section className="min-h-screen gradient-hero flex items-center justify-center pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                AI-Powered Travel Planning
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
              Plan Your Dream
              <span className="block gradient-primary bg-clip-text text-transparent">
                Adventure!
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Meet LlamaTrip, your friendly travel companion! I'll help you discover amazing destinations, 
              build personalized itineraries, and track all your bookings—with a smile! 🦙✨
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/plan">
                <Button variant="hero" size="lg" className="group">
                  <Plane className="mr-2 group-hover:rotate-12 transition-transform" />
                  Plan with LlamaTrip
                </Button>
              </Link>
              <Link to="/itinerary">
                <Button variant="outline" size="lg">
                  View My Trips
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-8 justify-center md:justify-start">
              <div>
                <p className="text-3xl font-heading font-bold gradient-primary bg-clip-text text-transparent">
                  500+
                </p>
                <p className="text-sm text-muted-foreground">Destinations</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-heading font-bold gradient-primary bg-clip-text text-transparent">
                  10k+
                </p>
                <p className="text-sm text-muted-foreground">Happy Travelers</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-heading font-bold gradient-primary bg-clip-text text-transparent">
                  24/7
                </p>
                <p className="text-sm text-muted-foreground">Llama Support</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-full" />
            <img 
              src={heroLlama} 
              alt="LlamaTrip mascot - a friendly llama wearing sunglasses and a backpack" 
              className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
