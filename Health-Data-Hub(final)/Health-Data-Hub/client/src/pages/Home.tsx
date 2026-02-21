import { useState } from "react";
import { mockHospitals, specializations, countries, Hospital } from "@/lib/mock-data";
import { HospitalCard } from "@/components/HospitalCard";
import { TripPlanner } from "@/components/TripPlanner";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, HeartPulse, Search, SlidersHorizontal, ArrowRightLeft, Shield, Clock, Sparkles } from "lucide-react";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [weightRating, setWeightRating] = useState([0.7]);
  const [weightDistance, setWeightDistance] = useState([0.3]);
  
  const [results, setResults] = useState<(Hospital & { score?: number; distance?: number })[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  
  const [planningHospital, setPlanningHospital] = useState<Hospital | null>(null);

  // Initial load
  useState(() => {
    setResults(mockHospitals);
  });

  const handleRecommend = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      let filtered = [...mockHospitals];
      
      if (selectedCountry !== "all") {
        filtered = filtered.filter(h => h.country === selectedCountry);
      }
      
      if (selectedSpecialty !== "all") {
        filtered = filtered.filter(h => h.specializations.includes(selectedSpecialty));
      }

      // Generate mock scores based on weights
      const scored = filtered.map(h => {
        const mockDistance = Math.floor(Math.random() * 10) + 1; // 1-10 hours flight mock
        // score = (rating * weightRating) - (distance * weightDistance)
        // Normalize rating to 1-10 for math
        const normRating = h.rating * 2; 
        const score = (normRating * weightRating[0]) - (mockDistance * weightDistance[0]);
        
        return {
          ...h,
          distance: mockDistance,
          score: Math.max(0, score) // ensure positive
        };
      });

      scored.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      setResults(scored);
      setIsSearching(false);
    }, 600);
  };

  const toggleCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) {
        // limit to 3, replace first
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain brightness-0 invert" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              medbridge<span className="text-primary">360</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-medium">Log in</Button>
            <Button className="font-semibold shadow-md shadow-primary/10 px-6">Sign up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
        >
          <Shield className="w-4 h-4" /> Trusted globally by 10,000+ patients
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.1]"
        >
          Your Health Journey, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Seamlessly Planned</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-xl text-muted-foreground max-w-2xl"
        >
          Discover top-rated hospitals worldwide, compare treatment costs, and organize your entire medical trip in one place.
        </motion.p>

        {/* Search / Recommend Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-4xl mt-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-3 rounded-3xl border border-white/40 shadow-2xl flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 flex items-center bg-white dark:bg-slate-950 rounded-2xl px-4 py-2 border border-border/50 shadow-sm">
            <Globe className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-10 text-base bg-transparent">
                <SelectValue placeholder="Any Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Country</SelectItem>
                {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 flex items-center bg-white dark:bg-slate-950 rounded-2xl px-4 py-2 border border-border/50 shadow-sm">
            <HeartPulse className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-10 text-base bg-transparent">
                <SelectValue placeholder="Any Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Specialty</SelectItem>
                {specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button 
            size="lg" 
            className="rounded-2xl h-14 md:w-32 text-base font-semibold shadow-lg shadow-primary/20"
            onClick={handleRecommend}
            disabled={isSearching}
          >
            {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Discover"}
          </Button>
        </motion.div>

        {/* Algorithm Weights (Mock UI for the API logic) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>AI Match Weighting:</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Quality ({(weightRating[0]*100).toFixed(0)}%)</span>
            <Slider 
              value={weightRating} 
              onValueChange={(v) => {
                setWeightRating(v);
                setWeightDistance([1 - v[0]]);
              }} 
              max={1} min={0} step={0.1} 
              className="w-24"
            />
            <span>Proximity ({(weightDistance[0]*100).toFixed(0)}%)</span>
          </div>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Floating Compare Bar */}
        <AnimatePresence>
          {compareList.length > 0 && !showCompare && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6"
            >
              <div className="flex items-center gap-2 font-medium">
                <ArrowRightLeft className="w-5 h-5" />
                {compareList.length} selected for comparison
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setCompareList([])}>Clear</Button>
                <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100" onClick={() => setShowCompare(true)}>Compare Now</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare View Overlay */}
        <AnimatePresence>
          {showCompare && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            >
              <Card className="w-full max-w-5xl bg-card border-border/50 shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Compare Hospitals</h2>
                  <Button variant="ghost" onClick={() => setShowCompare(false)}>Close</Button>
                </div>
                <div className="p-6 overflow-x-auto">
                  <div className="flex gap-6 min-w-max">
                    {compareList.map(id => {
                      const h = mockHospitals.find(h => h.id === id)!;
                      return (
                        <div key={h.id} className="w-80 space-y-6">
                          <img src={h.image} className="w-full h-40 object-cover rounded-xl" />
                          <div>
                            <h3 className="font-bold text-xl mb-1">{h.name}</h3>
                            <p className="text-muted-foreground text-sm">{h.city}, {h.country}</p>
                          </div>
                          
                          <div className="space-y-4 text-sm">
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-muted-foreground mb-1">Rating</div>
                              <div className="font-bold text-lg text-yellow-600">{h.rating} / 5.0</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-muted-foreground mb-1">Est. Cost</div>
                              <div className="font-bold">${h.treatmentCostRange.min.toLocaleString()} - ${h.treatmentCostRange.max.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="font-medium mb-2">Specializations</div>
                              <div className="flex flex-wrap gap-1.5">
                                {h.specializations.map(s => <span key={s} className="px-2 py-1 bg-secondary rounded text-xs">{s}</span>)}
                              </div>
                            </div>
                            <Button className="w-full mt-4" onClick={() => {
                              setShowCompare(false);
                              setPlanningHospital(h);
                            }}>Select & Plan</Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trip Planner Overlay */}
        <AnimatePresence>
          {planningHospital && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <TripPlanner hospital={planningHospital} onClose={() => setPlanningHospital(null)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {results.length > 0 ? (
              <>Recommended for You <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{results.length} found</span></>
            ) : "No hospitals found"}
          </h2>
          {results[0]?.score !== undefined && (
            <div className="text-sm text-primary flex items-center gap-1 font-medium">
              <Sparkles className="w-4 h-4" /> AI Sorted
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {results.map((hospital, i) => (
              <motion.div
                key={hospital.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <HospitalCard 
                  hospital={hospital} 
                  score={hospital.score}
                  distance={hospital.distance}
                  isComparing={compareList.includes(hospital.id)}
                  onCompare={toggleCompare}
                  onSelect={() => setPlanningHospital(hospital)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </section>

      <ChatWidget />
    </div>
  );
}