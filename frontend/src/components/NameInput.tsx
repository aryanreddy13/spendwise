import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface NameInputProps {
    onComplete: (name: string) => void;
}

export const NameInput = ({ onComplete }: NameInputProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const validateName = (value: string) => {
        if (value.length < 2) return false;
        if (!/^[a-zA-Z\s]+$/.test(value)) return false;
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (validateName(trimmedName)) {
            onComplete(trimmedName);
        } else {
            setError(t.onboarding.validationError);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <Card className="w-full max-w-md border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">{t.onboarding.title}</CardTitle>
                    <CardDescription className="text-lg">
                        {t.onboarding.subtitle}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nameInput" className="text-base">{t.onboarding.label} <span className="text-red-500">*</span></Label>
                            <Input
                                id="nameInput"
                                placeholder={t.onboarding.placeholder}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                className="h-12 text-lg"
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full text-base"
                            disabled={!name.trim() || !!error}
                        >
                            {t.onboarding.button}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
