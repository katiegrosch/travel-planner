import { useState } from "react";
import LlamaNav from "@/components/LlamaNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Hotel, 
  Map, 
  Plus, 
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface ItineraryItem {
  id: string;
  type: "flight" | "hotel" | "activity";
  title: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
}

const Itinerary = () => {
  const [items, setItems] = useState<ItineraryItem[]>([
    {
      id: "1",
      type: "flight",
      title: "Flight to Athens",
      date: "2025-06-15",
      time: "10:00 AM",
      location: "JFK → ATH",
      notes: "Bring passport and llama snacks!"
    },
    {
      id: "2",
      type: "hotel",
      title: "Santorini Sunset Hotel",
      date: "2025-06-15",
      time: "4:00 PM",
      location: "Santorini, Greece",
      notes: "Check-in, ocean view room"
    },
    {
      id: "3",
      type: "activity",
      title: "Sunset at Oia",
      date: "2025-06-16",
      time: "7:30 PM",
      location: "Oia, Santorini",
      notes: "Perfect for photos!"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getItemIcon = (type: string) => {
    switch (type) {
      case "flight": return Plane;
      case "hotel": return Hotel;
      case "activity": return Map;
      default: return Map;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case "flight": return "text-primary";
      case "hotel": return "text-secondary";
      case "activity": return "text-accent-foreground";
      default: return "text-muted-foreground";
    }
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from itinerary! 🦙");
  };

  return (
    <div className="min-h-screen bg-background">
      <LlamaNav />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce-gentle">🦙</div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Your <span className="text-primary">Dream Trip</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your personalized itinerary! Add, edit, or reorder as you like.
            </p>
          </div>

          {/* Trip Summary */}
          <Card className="p-6 mb-8 shadow-card gradient-secondary">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-wiggle">🦙</div>
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-semibold text-secondary-foreground mb-2">
                  Your Personalized Adventure by Llama, Inc.
                </h3>
                <p className="text-secondary-foreground/90">
                  Lleonard here! I've helped organize {items.length} amazing activities for your trip. 
                  Each one is hand-picked with llama love and expertise. Let's make this journey unforgettable! ✨
                </p>
              </div>
            </div>
          </Card>

          {/* Itinerary Items */}
          <div className="space-y-4 mb-8">
            {items.map((item, index) => {
              const Icon = getItemIcon(item.type);
              const colorClass = getItemColor(item.type);
              
              return (
                <Card 
                  key={item.id} 
                  className="p-6 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-heading font-semibold mb-1">{item.title}</h3>
                          <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {item.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {item.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="bg-accent/10 rounded-lg p-3">
                          <p className="text-sm flex items-start gap-2">
                            <span className="text-lg flex-shrink-0">🦙</span>
                            <span className="italic">{item.notes}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Add New Item Button */}
          <Card className="p-6 border-2 border-dashed border-border hover:border-primary/50 transition-smooth cursor-pointer group">
            <button 
              onClick={() => {
                toast.success("Add item feature coming soon! 🦙");
              }}
              className="w-full flex items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-smooth"
            >
              <Plus className="w-6 h-6" />
              <span className="font-medium">Add New Item</span>
            </button>
          </Card>

          {/* Llama Tips */}
          <Card className="p-6 mt-8 gradient-primary">
            <div className="flex items-start gap-4">
              <div className="text-4xl animate-wiggle">🦙</div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-primary-foreground mb-2">
                  Lleonard's Travel Tip
                </h3>
                <p className="text-primary-foreground/90">
                  Don't forget to pack light and leave room for souvenirs! And remember - 
                  the best travel companion is a happy llama (like me)! Have an amazing trip! 🌍✨ —Lleonard
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
