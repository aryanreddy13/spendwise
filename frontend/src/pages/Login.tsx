import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, CheckCircle2, ArrowRight, Wallet, TrendingUp, BookOpen } from 'lucide-react';
import { Chatbot } from '@/components/Chatbot';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { BankSelection } from '@/components/BankSelection';
import { NameInput } from '@/components/NameInput';

type LoginStep = 'login' | 'name-input' | 'buffering' | 'bank-selection';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsAuthenticated, hasCompletedOnboarding, completeOnboarding, updateSelectedBanks, setName, login, register } = useUser();
  const [isLogin, setIsLogin] = useState(true);

  const [isLoaded, setIsLoaded] = useState(false);

  // New Step-based state management
  const [step, setStep] = useState<LoginStep>('login');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      if (isLogin) {
        await login(email, password);
        // Login -> Buffer
        setStep('buffering');
      } else {
        await register(email, password);
        // Signup -> Name Input
        setStep('name-input');
      }
    } catch (err) {
      alert("Authentication failed. Please try again.");
    }
  };


  const handleNameSubmit = (name: string) => {
    setName(name);
    setStep('buffering');
  };

  const handleLoadingComplete = () => {
    // Auth is technically done here
    setIsAuthenticated(true);

    // Check if user has already onboarded
    if (!hasCompletedOnboarding) {
      setStep('bank-selection');
    } else {
      navigate('/dashboard');
    }
  };

  const handleBankSelectionComplete = (selected: string[]) => {
    updateSelectedBanks(selected);
    completeOnboarding();
    navigate('/dashboard');
  };

  const handleSkipBanks = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (step === 'name-input') {
    return <NameInput onComplete={handleNameSubmit} />;
  }

  if (step === 'buffering') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (step === 'bank-selection') {
    return <BankSelection onComplete={handleBankSelectionComplete} onSkip={handleSkipBanks} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden relative font-sans text-foreground">
      {/* Language Selector - Absolute Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* LEFT SIDE: Hero Section */}
      <div className="relative w-full md:w-1/2 lg:w-[55%] bg-gradient-to-br from-emerald-50 via-teal-50 to-lime-50 dark:from-emerald-950/20 dark:via-teal-900/20 dark:to-lime-900/20 p-8 md:p-16 flex flex-col justify-center overflow-hidden">

        {/* Background Decor Shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-200/30 dark:bg-green-800/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/30 dark:bg-teal-800/20 rounded-full blur-[80px] animate-pulse delay-700" />

        <div className={cn("relative z-10 max-w-xl transition-all duration-1000 ease-out transform", isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
            {t.landing.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              {t.landing.heroSubtitle}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-md">
            {t.landing.heroDesc}
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: Wallet, text: t.landing.features.track, delay: "delay-[200ms]" },
              { icon: TrendingUp, text: t.landing.features.risks, delay: "delay-[400ms]" },
              { icon: BookOpen, text: t.landing.features.learn, delay: "delay-[600ms]" }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-4 bg-white/60 dark:bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm w-fit transition-all duration-700 transform hover:scale-105 hover:shadow-md cursor-default",
                  isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0",
                  feature.delay
                )}
              >
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 md:p-12 relative bg-white/50 dark:bg-black/50">
        {/* Subtle Background Blob for Glass Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-transparent via-emerald-50/50 to-transparent dark:via-emerald-900/10 pointer-events-none" />

        <Card className={cn(
          "w-full max-w-md border-0 bg-white/70 dark:bg-black/60 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-700",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto mb-2 flex justify-center">
              <img src="/logo.png" alt="SpendWise Logo" className="w-16 h-16 object-contain" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">{t.app.name}</CardTitle>
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 pointer-events-none">
                  {t.landing.badge}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t.login.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.login.emailPlaceholder}
                    className="h-12 bg-white/50 dark:bg-black/20 border-muted-foreground/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.login.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-white/50 dark:bg-black/20 border-muted-foreground/20 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  {isLogin ? t.login.loginButton : t.login.signupButton}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? t.login.noAccount : t.login.hasAccount}{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold hover:underline transition-colors ml-1"
                  >
                    {isLogin ? t.landing.createAccountLink : t.login.loginButton}
                  </button>
                </p>
              </div>

              <div className="pt-6 mt-2">
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                  <Shield className="h-3 w-3" />
                  <span>{t.login.privacyNote}</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Chatbot />
    </div>
  );
};

export default Login;
