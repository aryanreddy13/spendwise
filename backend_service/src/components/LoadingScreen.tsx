import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
    onComplete?: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 2000); // 2 seconds duration as requested (1.5 - 2s)

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="flex flex-col items-center animate-pulse">
                {/* Logo Image */}
                <img
                    src="/logo.png"
                    alt="SpendWise Logo"
                    className="h-24 w-24 object-contain mb-6"
                />

                {/* Main Text */}
                <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
                    Setting up your finances…
                </h2>

                {/* Subtext */}
                <p className="text-muted-foreground text-sm font-medium">
                    Almost there 🚀
                </p>
            </div>

            {/* Optional: Rotating dotted loader if needed, but pulsing logo satisfies the requirement too. 
          Adding a small one for extra polish below */}
            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};
