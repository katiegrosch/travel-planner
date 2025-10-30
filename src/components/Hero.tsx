import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Sparkles, Globe2, Heart, Headphones } from "lucide-react";
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
              <span className="block text-primary">
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
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Destinations Card */}
              <div className="group bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-2xl p-6 shadow-soft hover-lift hover:shadow-glow transition-all cursor-pointer border border-orange-100/50 dark:border-orange-900/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Globe2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1 text-foreground">
                      Destinations
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Explore top llama-approved spots from Machu Picchu to the Alps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Happy Travelers Card */}
              <div className="group bg-gradient-to-br from-pink-50/80 to-orange-50/80 dark:from-pink-950/20 dark:to-orange-950/20 rounded-2xl p-6 shadow-soft hover-lift hover:shadow-glow transition-all cursor-pointer border border-pink-100/50 dark:border-pink-900/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1 text-foreground">
                      Happy Travelers
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      See stories from humans who've trotted the world with LlamaTrip.
                    </p>
                  </div>
                </div>
              </div>

              {/* Llama Support Card */}
              <div className="group bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-2xl p-6 shadow-soft hover-lift hover:shadow-glow transition-all cursor-pointer border border-yellow-100/50 dark:border-yellow-900/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1 text-foreground">
                      Llama Support
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Need help planning your adventure? LlamaTrip's herd is here to guide you.
                    </p>
                  </div>
                </div>
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
