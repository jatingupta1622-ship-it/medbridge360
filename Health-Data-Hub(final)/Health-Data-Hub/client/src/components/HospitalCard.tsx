import { Hospital } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Building, CheckCircle2, ChevronRight } from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
  score?: number;
  distance?: number;
  onSelect?: () => void;
  onCompare?: (id: number) => void;
  isComparing?: boolean;
}

export function HospitalCard({ hospital, score, distance, onSelect, onCompare, isComparing }: HospitalCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 border-border/50 group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={hospital.image} 
          alt={hospital.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-sm font-semibold flex items-center gap-1 text-yellow-600 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          {hospital.rating.toFixed(1)}
        </div>
        {score !== undefined && (
          <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
            Match Score: {score.toFixed(1)}
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-foreground leading-tight mb-1">{hospital.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm gap-1.5">
              <MapPin className="w-4 h-4" />
              {hospital.city}, {hospital.country}
              {distance && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">~{distance} hrs flight</span>}
            </div>
          </div>
        </div>

        <div className="mt-4 mb-4">
          <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Building className="w-4 h-4" /> Top Specializations
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hospital.specializations.slice(0, 3).map(spec => (
              <Badge key={spec} variant="secondary" className="font-normal bg-secondary/50">
                {spec}
              </Badge>
            ))}
            {hospital.specializations.length > 3 && (
              <Badge variant="outline" className="font-normal">
                +{hospital.specializations.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border/50 flex justify-between items-end mt-auto">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Est. Treatment Cost</div>
            <div className="font-semibold text-lg text-foreground">
              ${hospital.treatmentCostRange.min.toLocaleString()} - ${hospital.treatmentCostRange.max.toLocaleString()}
            </div>
          </div>
          {hospital.internationalPatientsSupported && (
            <div className="flex items-center gap-1 text-xs font-medium text-accent">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Intl. Friendly
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 gap-2">
        <Button 
          variant={isComparing ? "secondary" : "outline"} 
          className="w-full" 
          onClick={(e) => {
            e.stopPropagation();
            onCompare?.(hospital.id);
          }}
          data-testid={`button-compare-${hospital.id}`}
        >
          {isComparing ? "Added to Compare" : "Compare"}
        </Button>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
          onClick={onSelect}
          data-testid={`button-plan-${hospital.id}`}
        >
          Plan Trip <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}