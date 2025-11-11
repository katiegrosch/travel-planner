import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LlamaNav from "@/components/LlamaNav";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import SubscribeButton from "@/components/SubscribeButton";
import SentryTestButton from "@/components/SentryTestButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Compass, Calendar, Shield } from "lucide-react";
import { toast } from "sonner";

import beachLlama from "@/assets/beach-llama.png";
import mountainLlama from "@/assets/mountain-llama.png";
import cityLlama from "@/assets/city-llama.png";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const subscribed = searchParams.get('subscribed');
    
    if (subscribed === 'success') {
      toast.success("🎉 Welcome to LlamaTrip!", {
        description: "You're now subscribed! Lleonard is excited to help you plan amazing adventures.",
        duration: 5000,
      });
      // Clean up the URL
      searchParams.delete('subscribed');
      searchParams.delete('session_id');
      setSearchParams(searchParams, { replace: true });
    } else if (subscribed === 'cancelled') {
      toast.info("Checkout Cancelled", {
        description: "No worries! You can subscribe anytime when you're ready.",
        duration: 4000,
      });
      // Clean up the URL
      searchParams.delete('subscribed');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const featuredDestinations = [
    {
      title: "Tropical Paradise",
      description: "White sand beaches, crystal clear waters, and endless sunshine await you.",
      llamaComment: "You'll love these beaches - perfect for llama selfies and coconut drinks! —Lleonard",
      image: beachLlama,
      rating: 4.9,
      location: "Maldives"
    },
    {
      title: "Mountain Adventure",
      description: "Majestic peaks, fresh alpine air, and breathtaking hiking trails.",
      llamaComment: "This mountain is excellent for selfies with fellow llamas! Trust me, I'm a mountain expert. —Lleonard",
      image: mountainLlama,
      rating: 4.8,
      location: "Swiss Alps"
    },
    {
      title: "Urban Explorer",
      description: "Vibrant city life, world-class dining, and endless cultural experiences.",
      llamaComment: "So many food options! I can guide you to the best street tacos in town! —Lleonard",
      image: cityLlama,
      rating: 4.7,
      location: "Tokyo, Japan"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Personalized Recommendations",
      description: "Tell me what you love, and I'll find your perfect destination!"
    },
    {
      icon: Compass,
      title: "Smart Itinerary Builder",
      description: "Build, edit, and organize your trip with easy drag-and-drop."
    },
    {
      icon: Calendar,
      title: "All-in-One Planner",
      description: "Track flights, hotels, and activities in one cheerful place."
    },
    {
      icon: Shield,
      title: "Trusted & Secure",
      description: "Your travel plans are safe with llama-grade security!"
    }
  ];

  return (
    <div className="min-h-screen">
      <LlamaNav />
      <Hero />
      
      {/* Featured Destinations */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Popular <span className="text-primary">Destinations</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out these amazing places that other travelers (and llamas) absolutely love!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredDestinations.map((dest, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <DestinationCard {...dest} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/plan">
              <Button variant="hero" size="lg">
                Discover More Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 gradient-hero">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Why Travel with <span className="text-primary">LlamaTrip?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Because planning your dream vacation should be fun, not stressful!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-card hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="gradient-primary rounded-3xl p-12 text-center shadow-glow">
            <div className="text-6xl mb-6 animate-bounce-gentle">🦙</div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Let's plan something amazing together! I'm Lleonard, and I promise to make it fun and stress-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SubscribeButton 
                priceId={import.meta.env.VITE_STRIPE_PRICE_ID}
                variant="outline"
                size="lg"
                className="bg-card hover:bg-card/90"
              >
                Subscribe for $1/month
              </SubscribeButton>
              <Link to="/plan">
                <Button variant="outline" size="lg" className="bg-card/80 hover:bg-card/70">
                  Try Free Planning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🦙</span>
            <p className="text-lg font-heading font-semibold">LlamaTrip</p>
          </div>
          <p className="text-muted-foreground mb-4">
            Your friendly travel planning companion, featuring Lleonard the llama
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 Llama, Inc. Made with ❤️ and llamas.
          </p>
        </div>
      </footer>
      
      {/* Show Sentry test controls in development */}
      {import.meta.env.DEV && <SentryTestButton />}
    </div>
  );
};

export default Index;
