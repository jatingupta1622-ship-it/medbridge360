import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your MediJourney AI assistant. I can help you find the right hospital, explain procedures, or answer questions about medical travel. How can I help today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let aiResponse = "I can definitely help with that! Our platform has several top-rated hospitals for that specialization. Would you like me to recommend a few based on your preferences?";
      
      const lowerInput = userMsg.content.toLowerCase();
      if (lowerInput.includes("heart") || lowerInput.includes("cardiology")) {
        aiResponse = "For cardiology, Apollo Hospitals in India and Cleveland Clinic in UAE are among the highest rated globally. They offer comprehensive heart care with state-of-the-art facilities.";
      } else if (lowerInput.includes("cost") || lowerInput.includes("price")) {
        aiResponse = "Treatment costs vary significantly by region. For instance, procedures in Southeast Asia (like Thailand or India) can be 40-70% less expensive than in the US, with comparable quality of care.";
      } else if (lowerInput.includes("timeline") || lowerInput.includes("long")) {
        aiResponse = "A typical medical trip lasts 7-14 days. We usually recommend arriving 1-2 days before the procedure for consultations, followed by the treatment, and a 4-7 day recovery period before flying back.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 sm:w-96 shadow-2xl border-0 overflow-hidden flex flex-col h-[500px] glass-panel">
              <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">MediJourney AI</h3>
                    <p className="text-xs text-primary-foreground/70">Always here to help</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground self-end rounded-br-sm" 
                        : "bg-white dark:bg-slate-800 border border-border/50 text-foreground self-start rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="bg-white dark:bg-slate-800 border border-border/50 text-foreground self-start rounded-2xl rounded-bl-sm p-3 w-16 shadow-sm">
                    <div className="flex gap-1 justify-center">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <CardFooter className="p-3 bg-white dark:bg-slate-950 border-t border-border/50">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                  className="flex w-full items-center gap-2"
                >
                  <Input 
                    placeholder="Ask about hospitals..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 rounded-full bg-slate-50 dark:bg-slate-900 border-border"
                  />
                  <Button type="submit" size="icon" className="rounded-full shrink-0 shadow-sm" disabled={!inputValue.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors",
          isOpen ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-800" : "bg-primary text-white"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}