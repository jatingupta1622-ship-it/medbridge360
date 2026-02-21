import { useState } from "react";
import { Hospital } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plane, Hotel, Stethoscope, HeartPulse, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TripPlannerProps {
  hospital: Hospital;
  onClose: () => void;
}

export function TripPlanner({ hospital, onClose }: TripPlannerProps) {
  const [date, setDate] = useState<Date>(addDays(new Date(), 30));
  const [stayDays, setStayDays] = useState<number[]>([7]);
  const [isGenerated, setIsGenerated] = useState(false);

  const generateTimeline = () => {
    setIsGenerated(true);
  };

  const getTimelineEvents = (startDate: Date, days: number) => {
    const events = [];
    events.push({
      day: 1,
      date: format(startDate, "MMM do"),
      icon: Plane,
      title: "Arrival & Transfer",
      desc: `Arrival in ${hospital.city}. VIP transfer to your hotel. Rest and acclimate.`,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    });
    
    events.push({
      day: 2,
      date: format(addDays(startDate, 1), "MMM do"),
      icon: Stethoscope,
      title: "Initial Consultation",
      desc: `Meet with your specialist at ${hospital.name}. Pre-operation tests and screenings.`,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    });

    events.push({
      day: 3,
      date: format(addDays(startDate, 2), "MMM do"),
      icon: HeartPulse,
      title: "Procedure / Treatment",
      desc: "Scheduled treatment day. Dedicated international patient coordinator will be with you.",
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    });

    if (days > 5) {
      events.push({
        day: Math.floor(days / 2) + 1,
        date: format(addDays(startDate, Math.floor(days / 2)), "MMM do"),
        icon: Hotel,
        title: "Recovery",
        desc: "In-patient or hotel recovery with daily nursing visits and remote monitoring.",
        color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
      });
    }

    events.push({
      day: days,
      date: format(addDays(startDate, days - 1), "MMM do"),
      icon: Sparkles,
      title: "Final Check & Departure",
      desc: "Final clearance from your doctor. VIP transfer back to the airport.",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    });

    return events;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl glass-panel">
      <CardHeader className="bg-primary/5 border-b border-border/40 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              Plan Your Journey
            </CardTitle>
            <CardDescription className="text-base mt-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {hospital.name} • {hospital.city}, {hospital.country}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">Close</Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {!isGenerated ? (
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                When would you like to travel?
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 text-base",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 opacity-70" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold">Duration of Stay</label>
                <span className="font-bold text-primary">{stayDays[0]} Days</span>
              </div>
              <Slider
                value={stayDays}
                onValueChange={setStayDays}
                max={30}
                min={3}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Short procedure (3d)</span>
                <span>Major surgery (14d+)</span>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg mt-4 shadow-lg shadow-primary/20" 
              onClick={generateTimeline}
            >
              Generate Itinerary
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="font-bold text-lg">Your Medical Itinerary</h3>
              <Button variant="outline" size="sm" onClick={() => setIsGenerated(false)}>Edit</Button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {getTimelineEvents(date, stayDays[0]).map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  key={event.day} 
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                    event.color
                  )}>
                    <event.icon className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-foreground">{event.title}</h4>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">Day {event.day}</span>
                    </div>
                    <div className="text-xs text-primary font-medium mb-2">{event.date}</div>
                    <p className="text-sm text-muted-foreground">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 flex gap-3">
              <Button className="w-full">Book This Trip</Button>
              <Button variant="outline" className="w-full">Download PDF</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}