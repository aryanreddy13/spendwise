import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plane, Smartphone, ShieldCheck, Target, Trophy, Info, Plus, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";


const Goals = () => {
    const { t } = useTranslation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentSaved: '',
        date: ''
    });

    // Calculation State
    const [calculations, setCalculations] = useState<{
        monthlyRequired: number;
        daysLeft: number;
        monthsRemaining: number;
        isValid: boolean;
        error?: string;
    } | null>(null);

    // Initial Mock Data can't easily use t() inside useState initializer if we want it to update on lang change
    // simpler to just store status codes and render labels dynamically
    const [goals, setGoals] = useState([
        {
            id: 1,
            name: "Emergency Fund",
            target: 100000,
            current: 45000,
            monthly: 5000,
            icon: ShieldCheck,
            status: "on-track",
            color: "text-green-500",
            barColor: "bg-green-500",
            daysLeft: 120,
            targetDate: "30/05/2026"
        },
        {
            id: 2,
            name: "Trip to Goa",
            target: 30000,
            current: 12000,
            monthly: 2000,
            icon: Plane,
            status: "behind",
            color: "text-orange-500",
            barColor: "bg-orange-500",
            daysLeft: 45,
            targetDate: "15/03/2026"
        },
        {
            id: 3,
            name: "New iPhone",
            target: 80000,
            current: 25000,
            monthly: 3500,
            icon: Smartphone,
            status: "at-risk",
            color: "text-red-500",
            barColor: "bg-red-500",
            daysLeft: 60,
            targetDate: "01/04/2026"
        }
    ]);

    const getStatusLabel = (status: string) => {
        if (status === 'on-track') return t.goals.onTrack;
        if (status === 'behind') return t.goals.behind;
        return t.goals.atRisk;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let newValue = value;

        // Auto-correct date separators
        if (name === 'date') {
            newValue = value.replace(/-/g, '/');
            if (newValue.length === 2 && formData.date.length === 1 && !newValue.includes('/')) newValue += '/';
            if (newValue.length === 5 && formData.date.length === 4 && !newValue.endsWith('/')) newValue += '/';
        }

        const updatedFormData = { ...formData, [name]: newValue };
        setFormData(updatedFormData);

        // Trigger calculation if we have enough data
        if (updatedFormData.targetAmount && updatedFormData.date.length === 10) {
            calculateGoalMetrics(updatedFormData.targetAmount, updatedFormData.currentSaved, updatedFormData.date);
        } else {
            setCalculations(null);
        }
    };

    const calculateGoalMetrics = (target: string, current: string, dateStr: string) => {
        const targetAmount = parseFloat(target);
        const currentAmount = parseFloat(current) || 0;

        // Parse Date (DD/MM/YYYY)
        const [day, month, year] = dateStr.split('/').map(Number);
        const targetDate = new Date(year, month - 1, day);
        const today = new Date();

        // Validation
        if (isNaN(targetDate.getTime()) || targetDate <= today) {
            setCalculations({
                monthlyRequired: 0,
                daysLeft: 0,
                monthsRemaining: 0,
                isValid: false,
                error: t.goals.validFutureDate
            });
            return;
        }

        const timeDiff = targetDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const monthsRemaining = Math.max(daysLeft / 30.44, 1); // Avoid division by zero

        const remainingAmount = Math.max(targetAmount - currentAmount, 0);
        const monthlyRequired = Math.ceil(remainingAmount / monthsRemaining);

        setCalculations({
            monthlyRequired,
            daysLeft,
            monthsRemaining: parseFloat(monthsRemaining.toFixed(1)),
            isValid: true
        });
    };

    const createGoal = () => {
        if (!calculations?.isValid || !formData.name) return;

        const newGoal = {
            id: Date.now(),
            name: formData.name,
            target: parseFloat(formData.targetAmount),
            current: parseFloat(formData.currentSaved) || 0,
            monthly: calculations.monthlyRequired,
            icon: Target, // Default icon
            status: "on-track",
            color: "text-blue-500", // Default color
            barColor: "bg-blue-500",
            daysLeft: calculations.daysLeft,
            targetDate: formData.date
        };

        setGoals([...goals, newGoal]);
        setIsDialogOpen(false);
        setFormData({ name: '', targetAmount: '', currentSaved: '', date: '' });
        setCalculations(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.goals.title}</h1>
            </div>

            {/* Priority Goal Banner */}
            <Card className="bg-primary/5 border-primary/20 dark:bg-primary/10">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{t.goals.priority} Emergency Fund</h2>
                            <p className="text-sm text-muted-foreground">{t.goals.priorityDesc}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Goal Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                    const percentage = Math.round((goal.current / goal.target) * 100);
                    return (
                        <Card key={goal.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-semibold">
                                    {goal.name}
                                </CardTitle>
                                <div className={cn("p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors", goal.color)}>
                                    <goal.icon className="h-5 w-5" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-2xl font-bold">₹{goal.current.toLocaleString()}</div>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                        <span>{t.common.target}: ₹{goal.target.toLocaleString()}</span>
                                        <div className="flex flex-col items-end">
                                            <span>{goal.daysLeft} {t.common.days} {t.common.left}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground text-right mt-0.5">
                                        {t.common.due}: {goal.targetDate}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Progress
                                        value={percentage}
                                        className={cn("h-2 dark:bg-muted/30", `[&>div]:dark:${goal.color.replace('text-', 'bg-')}`, `[&>div]:${goal.color.replace('text-', 'bg-')}`)}
                                    />
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium">{percentage}%</span>
                                        <Badge variant={goal.status === 'on-track' ? 'outline' : 'secondary'} className={cn(
                                            "font-normal text-[10px] h-5 px-1.5",
                                            goal.status === 'on-track' ? "text-green-600 bg-green-50 border-none" :
                                                goal.status === 'behind' ? "text-orange-600 bg-orange-50" : "text-red-600 bg-red-50"
                                        )}>
                                            {getStatusLabel(goal.status)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
                                    <Info className="h-3 w-3" />
                                    <span>{t.goals.save} <strong>₹{goal.monthly.toLocaleString()}</strong> / {t.goals.month}</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Card className="flex flex-col items-center justify-center border-dashed border-2 cursor-pointer hover:bg-muted/30 transition-colors py-12 min-h-[250px]">
                            <div className="p-4 rounded-full bg-primary/5 mb-4 group-hover:bg-primary/10">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <p className="font-medium text-foreground">{t.goals.createNew}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t.goals.createDesc}</p>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{t.goals.createModalTitle}</DialogTitle>
                            <DialogDescription>
                                {t.goals.createModalDesc}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t.goals.nameLabel}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Dream Vacation"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="targetAmount">{t.goals.targetLabel}</Label>
                                    <Input
                                        id="targetAmount"
                                        name="targetAmount"
                                        type="number"
                                        placeholder="₹ 1,00,000"
                                        value={formData.targetAmount}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="currentSaved">{t.goals.currentLabel}</Label>
                                    <Input
                                        id="currentSaved"
                                        name="currentSaved"
                                        type="number"
                                        placeholder="₹ 0"
                                        value={formData.currentSaved}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">{t.goals.dateLabel}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="relative cursor-pointer">
                                            <Input
                                                id="date"
                                                name="date"
                                                placeholder="DD/MM/YYYY"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="pl-9 cursor-pointer"
                                                maxLength={10}
                                                autoComplete="off"
                                            />
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.date.length === 10 ? (() => {
                                                const [day, month, year] = formData.date.split('/').map(Number);
                                                const date = new Date(year, month - 1, day);
                                                return isNaN(date.getTime()) ? undefined : date;
                                            })() : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    const dateStr = format(date, 'dd/MM/yyyy');
                                                    setFormData(prev => ({ ...prev, date: dateStr }));
                                                    // Trigger calculation
                                                    if (formData.targetAmount) {
                                                        calculateGoalMetrics(formData.targetAmount, formData.currentSaved, dateStr);
                                                    }
                                                }
                                            }}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Dynamic Calculations */}
                            {calculations && calculations.isValid && (
                                <div className="bg-primary/5 p-4 rounded-lg space-y-2 border border-primary/20">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t.goals.daysRemaining}:</span>
                                        <span className="font-medium">{calculations.daysLeft} {t.common.days}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t.goals.monthsRemaining}:</span>
                                        <span className="font-medium">{calculations.monthsRemaining} {t.common.months}</span>
                                    </div>
                                    <div className="border-t border-primary/20 pt-2 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-primary">{t.goals.requiredMonthly}:</span>
                                        <span className="text-lg font-bold text-primary">₹{calculations.monthlyRequired.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {calculations && !calculations.isValid && calculations.error && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">{calculations.error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
                            <Button onClick={createGoal} disabled={!calculations?.isValid || !formData.name}>{t.goals.createButton}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Goals;
