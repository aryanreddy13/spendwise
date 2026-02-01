import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Building2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

// Indian Banks Data
const BANKS = [
    { id: 'sbi', name: 'SBI', icon: Building2 }, // Using Lucide icons as placeholders for bank logos
    { id: 'hdfc', name: 'HDFC Bank', icon: Building2 },
    { id: 'icici', name: 'ICICI Bank', icon: Building2 },
    { id: 'axis', name: 'Axis Bank', icon: Building2 },
    { id: 'kotak', name: 'Kotak Mahindra', icon: Building2 },
    { id: 'yes', name: 'Yes Bank', icon: Building2 },
    { id: 'bob', name: 'Bank of Baroda', icon: Building2 },
    { id: 'pnb', name: 'Punjab National Bank', icon: Building2 },
];

interface BankSelectionProps {
    onComplete: (selected: string[]) => void;
    onSkip: () => void;
}

export const BankSelection = ({ onComplete, onSkip }: BankSelectionProps) => {
    // We can assume 't' exists or just hardcode for this specific feature request
    // integrating rudimentary translation support if keys existed, else English defaults
    const [selected, setSelected] = useState<string[]>([]);
    const [otherBank, setOtherBank] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);

    const toggleBank = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(b => b !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleContinue = () => {
        let finalSelection = [...selected];
        if (showOtherInput && otherBank.trim()) {
            finalSelection.push(`Other: ${otherBank.trim()}`);
        }
        onComplete(finalSelection);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <Card className="w-full max-w-3xl border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">Select Your Banks</CardTitle>
                    <CardDescription className="text-lg">
                        This helps us personalize your financial insights.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {BANKS.map((bank) => {
                            const isSelected = selected.includes(bank.id);
                            return (
                                <div
                                    key={bank.id}
                                    onClick={() => toggleBank(bank.id)}
                                    className={cn(
                                        "relative group cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:shadow-md",
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-md"
                                            : "border-border bg-card hover:border-primary/50"
                                    )}
                                >
                                    {/* Selection Badge */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground animate-in zoom-in duration-200">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}

                                    {/* Icon Placeholder */}
                                    <div className={cn(
                                        "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                    )}>
                                        <bank.icon className="h-6 w-6" />
                                    </div>

                                    <span className="font-medium text-sm text-center">{bank.name}</span>
                                </div>
                            );
                        })}

                        {/* Other Bank Option */}
                        <div
                            onClick={() => setShowOtherInput(!showOtherInput)}
                            className={cn(
                                "relative group cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:shadow-md",
                                showOtherInput
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border bg-card hover:border-primary/50"
                            )}
                        >
                            {showOtherInput && (
                                <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                            <div className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                                showOtherInput ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                <Wallet className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-sm text-center">Other Bank</span>
                        </div>
                    </div>

                    {/* Other Input Field */}
                    {showOtherInput && (
                        <div className="animate-in slide-in-from-top-2 fade-in">
                            <Input
                                placeholder="Enter bank name..."
                                value={otherBank}
                                onChange={(e) => setOtherBank(e.target.value)}
                                className="max-w-md mx-auto"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="w-full max-w-sm text-base"
                            onClick={handleContinue}
                            disabled={selected.length === 0 && (!showOtherInput || !otherBank.trim())}
                        >
                            Continue to Dashboard
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={onSkip}
                        >
                            Skip for now
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};
