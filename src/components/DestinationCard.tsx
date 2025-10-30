import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

interface DestinationCardProps {
  title: string;
  description: string;
  llamaComment: string;
  image: string;
  rating: number;
  location: string;
  onClick?: () => void;
}

const DestinationCard = ({ 
  title, 
  description, 
  llamaComment, 
  image, 
  rating, 
  location,
  onClick 
}: DestinationCardProps) => {
  return (
    <Card className="overflow-hidden hover-lift cursor-pointer group" onClick={onClick}>
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={`${title} destination with llama guide`}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-semibold text-sm">{rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-heading font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="bg-accent/10 rounded-lg p-3 mb-4">
          <p className="text-sm flex items-start gap-2">
            <span className="text-xl flex-shrink-0">🦙</span>
            <span className="italic text-foreground">"{llamaComment}"</span>
          </p>
        </div>
        
        <Button className="w-full" variant="hero">
          Explore {title}
        </Button>
      </div>
    </Card>
  );
};

export default DestinationCard;
