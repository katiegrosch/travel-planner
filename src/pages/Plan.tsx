import { useState } from "react";
import LlamaNav from "@/components/LlamaNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Mountain, 
  Building2, 
  Utensils, 
  Camera, 
  Heart,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Interest {
  id: string;
  name: string;
  icon: typeof Waves;
  selected: boolean;
}

const Plan = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"interests" | "suggestions">("interests");
  const [interests, setInterests] = useState<Interest[]>([
    { id: "beach", name: "Beaches", icon: Waves, selected: false },
    { id: "mountain", name: "Mountains", icon: Mountain, selected: false },
    { id: "city", name: "Cities", icon: Building2, selected: false },
    { id: "food", name: "Food & Dining", icon: Utensils, selected: false },
    { id: "photography", name: "Photography", icon: Camera, selected: false },
    { id: "culture", name: "Culture & Arts", icon: Heart, selected: false },
  ]);

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.map(interest =>
        interest.id === id ? { ...interest, selected: !interest.selected } : interest
      )
    );
  };

  const handleContinue = () => {
    const selectedCount = interests.filter(i => i.selected).length;
    if (selectedCount === 0) {
      toast.error("Please select at least one interest!");
      return;
    }
    setStep("suggestions");
  };

  const handleCreateItinerary = () => {
    toast.success("Great! Let's create your itinerary! 🦙");
    navigate("/itinerary");
  };

  return (
    <div className="min-h-screen bg-background">
      <LlamaNav />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {step === "interests" && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6 animate-bounce-gentle">🦙</div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Hi there! I'm <span className="text-primary">Lleonard</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Tell me what you love, and I'll help you plan the perfect adventure!
              </p>
            </div>

            <Card className="p-8 shadow-card">
              <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                What interests you?
              </h2>
              <p className="text-muted-foreground mb-8">
                Select all that apply - the more I know, the better I can help!
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {interests.map((interest) => {
                  const Icon = interest.icon;
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`
                        p-6 rounded-xl border-2 transition-all
                        ${interest.selected
                          ? 'border-primary bg-primary/10 shadow-soft'
                          : 'border-border hover:border-primary/50 hover:bg-accent/5'
                        }
                      `}
                    >
                      <Icon className={`w-8 h-8 mb-3 mx-auto ${interest.selected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`font-medium ${interest.selected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {interest.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              <Button 
                onClick={handleContinue}
                variant="hero" 
                size="lg" 
                className="w-full"
              >
                Continue
                <ArrowRight className="ml-2" />
              </Button>
            </Card>
          </div>
        )}

        {step === "suggestions" && (
          <div className="max-w-4xl mx-auto animate-slide-in-up">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6 animate-wiggle">🦙</div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Perfect! Here are my <span className="text-primary">suggestions</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Based on your interests, I think you'll love these destinations!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  title: "Santorini, Greece",
                  type: "Beach & Culture",
                  description: "White-washed buildings, stunning sunsets, and amazing Greek food!",
                  llamaQuote: "The sunsets here are so beautiful, even llamas stop to take pictures! 📸 —Lleonard",
                  badges: ["Beaches", "Food & Dining", "Photography"]
                },
                {
                  title: "Kyoto, Japan",
                  type: "Culture & Food",
                  description: "Ancient temples, serene gardens, and world-class cuisine.",
                  llamaQuote: "The cherry blossoms and sushi are absolutely worth the trip! —Lleonard",
                  badges: ["Cities", "Culture & Arts", "Food & Dining"]
                },
                {
                  title: "Banff, Canada",
                  type: "Mountain Adventure",
                  description: "Pristine lakes, majestic mountains, and incredible wildlife.",
                  llamaQuote: "My cousin Larry lives here - he says the hiking is unbe-llama-ble! —Lleonard",
                  badges: ["Mountains", "Photography"]
                }
              ].map((destination, index) => (
                <Card key={index} className="p-6 hover-lift animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <h3 className="text-2xl font-heading font-semibold mb-2">{destination.title}</h3>
                  <p className="text-sm text-primary mb-3">{destination.type}</p>
                  <p className="text-muted-foreground mb-4">{destination.description}</p>
                  
                  <div className="bg-accent/10 rounded-lg p-3 mb-4">
                    <p className="text-sm flex items-start gap-2">
                      <span className="text-xl flex-shrink-0">🦙</span>
                      <span className="italic">"{destination.llamaQuote}"</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {destination.badges.map((badge, i) => (
                      <Badge key={i} variant="secondary">{badge}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={() => setStep("interests")}>
                Change Interests
              </Button>
              <Button variant="hero" size="lg" onClick={handleCreateItinerary}>
                Create My Itinerary
                <Sparkles className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;
