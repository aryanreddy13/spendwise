import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useUser } from '@/contexts/UserContext';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export const Chatbot = () => {
    const { t } = useTranslation();
    const { name } = useUser();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial greeting - Run only once on mount
    useEffect(() => {
        const greeting = name
            ? `Heyy ${name}, I got you 👋`
            : t.chatbot.greeting;
        setMessages([{
            role: 'bot',
            content: greeting
        }]);
    }, [t, name]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        // Casual, friendly mock response
        setTimeout(() => {
            let botResponse = "I'm still learning, but that sounds important! 🚀";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes('roast')) {
                botResponse = "Bestie, your spending is looking kinda... sus. 💀";
            } else if (lowerMsg.includes('score')) {
                botResponse = "You're doing great! solid 8/10. Keep it up! 🌟";
            } else if (lowerMsg.includes('spend') || lowerMsg.includes('expense')) {
                botResponse = "Coffee is life, but maybe chill on the ₹500 lattes? ☕";
            } else if (lowerMsg.includes('budget')) {
                botResponse = "Budgets are boring but helpful. I gotchu.";
            } else if (lowerMsg.includes('goal')) {
                botResponse = "Manifesting that for you! ✨";
            }

            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Icon */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 transition-all duration-300",
                    isOpen ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 translate-y-0"
                )}
            >
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-[0_0_20px_rgba(34,197,94,0.4)] bg-primary hover:bg-primary/90 text-primary-foreground animate-in fade-in zoom-in duration-300"
                >
                    <Sparkles className="h-7 w-7" />
                </Button>
            </div>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-80 md:w-96 transition-all duration-300 transform origin-bottom-right",
                    isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                )}
            >
                <Card className="border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-background/95">
                    <CardHeader className="p-4 bg-primary/10 flex flex-row items-center justify-between border-b border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    Noob
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                </CardTitle>
                                <p className="text-[10px] text-muted-foreground">{t.chatbot.subtext}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 rounded-full" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted/80 text-foreground rounded-bl-none backdrop-blur-sm"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 gap-2 border-t bg-muted/20">
                        <Input
                            placeholder={t.chatbot.placeholder}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 rounded-full px-4"
                        />
                        <Button size="icon" onClick={handleSend} disabled={!input.trim()} className="rounded-full h-10 w-10 shrink-0">
                            <Send className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};
