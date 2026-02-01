import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Onboarding = () => {
    const { t } = useTranslation();
    const { setName } = useUser();
    const [tempName, setTempName] = useState("");
    const [error, setError] = useState("");

    const validateName = (name: string) => {
        if (name.length < 2) return false;
        // Alphabet + spaces only (supporting basic letters and common accents if needed, 
        // but sticking to prompt's "Alphabet + spaces only" likely means a-z A-Z)
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(name);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateName(tempName)) {
            setName(tempName.trim());
        } else {
            setError(t.onboarding.validationError);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 min-h-screen animate-in fade-in duration-500">
            <Card className="w-full max-w-md shadow-2xl border-primary/10 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                <CardHeader className="text-center space-y-2 pb-6 pt-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 transform hover:rotate-6 transition-transform">
                        <span className="text-primary font-bold text-3xl">S</span>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{t.onboarding.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t.onboarding.subtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {t.onboarding.label}
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder={t.onboarding.placeholder}
                                value={tempName}
                                onChange={(e) => {
                                    setTempName(e.target.value);
                                    if (error) setError("");
                                }}
                                className="h-12 bg-white/50 dark:bg-black/20 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 rounded-xl transition-all text-lg px-4"
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 py-3">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs font-medium lowercase first-letter:uppercase">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 bg-primary hover:bg-primary/90"
                        >
                            {t.onboarding.button}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
