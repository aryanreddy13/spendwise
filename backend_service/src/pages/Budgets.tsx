import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const Budgets = () => {
    const { t } = useTranslation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [budgets, setBudgets] = useState([
        { name: 'Food & Dining', spent: 12000, total: 15000, risk: false, startDate: '01/01/2026', endDate: '31/01/2026' },
        { name: 'Transportation', spent: 4500, total: 5000, risk: true, startDate: '01/01/2026', endDate: '31/01/2026' },
        { name: 'Shopping', spent: 8000, total: 10000, risk: false, startDate: '01/01/2026', endDate: '31/01/2026' },
        { name: 'Entertainment', spent: 4800, total: 4000, risk: true, startDate: '01/01/2026', endDate: '31/01/2026' },
    ]);

    // New Budget Form State
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Auto-calculated fields
    const [durationDays, setDurationDays] = useState(0);
    const [monthlyLimit, setMonthlyLimit] = useState(0);

    const handleDateChange = (start: string, end: string) => {
        // Simple date parsing DD/MM/YYYY
        if (start.length === 10 && end.length === 10) {
            const parseDate = (d: string) => {
                const [day, month, year] = d.split('/').map(Number);
                return new Date(year, month - 1, day);
            };

            const s = parseDate(start);
            const e = parseDate(end);

            if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
                const diffTime = Math.abs(e.getTime() - s.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDurationDays(diffDays);

                // Roughly calc monthly
                const months = diffDays / 30;
                if (months > 0 && amount) {
                    setMonthlyLimit(parseInt(amount) / months);
                }
            }
        }
    };

    const handleAddBudget = () => {
        if (!category || !amount || !startDate || !endDate) {
            toast.error(t.budgets.fillAllFields);
            return;
        }

        // Basic Date Validation
        const parseDate = (d: string) => {
            const parts = d.split('/');
            if (parts.length !== 3) return null;
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        };

        const s = parseDate(startDate);
        const e = parseDate(endDate);

        if (!s || !e || isNaN(s.getTime()) || isNaN(e.getTime())) {
            toast.error(t.budgets.invalidDate);
            return;
        }

        if (e <= s) {
            toast.error(t.budgets.dateOrderError);
            return;
        }

        setBudgets([...budgets, {
            name: category,
            spent: 0,
            total: parseInt(amount),
            risk: false,
            startDate: startDate,
            endDate: endDate
        }]);

        setIsDialogOpen(false);
        toast.success(t.budgets.successMessage);

        // Reset form
        setCategory('');
        setAmount('');
        setStartDate('');
        setEndDate('');
        setDurationDays(0);
        setMonthlyLimit(0);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">{t.budgets.title}</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> {t.budgets.addBudget}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t.budgets.createModalTitle}</DialogTitle>
                            <DialogDescription>{t.budgets.createModalDesc}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">{t.budgets.category}</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder={t.billCategories.selectCategory} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Food & Dining">{t.expenses.categories.food}</SelectItem>
                                        <SelectItem value="Transportation">{t.expenses.categories.transport}</SelectItem>
                                        <SelectItem value="Shopping">{t.expenses.categories.shopping}</SelectItem>
                                        <SelectItem value="Entertainment">{t.expenses.categories.entertainment}</SelectItem>
                                        <SelectItem value="Bills & Utilities">{t.expenses.categories.bills}</SelectItem>
                                        <SelectItem value="Travel">{t.expenses.categories.other}</SelectItem>
                                        <SelectItem value="Health">{t.expenses.categories.other}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">{t.budgets.amount}</Label>
                                <Input
                                    id="amount"
                                    className="col-span-3"
                                    type="number"
                                    placeholder="e.g. 5000"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        // Update calcs if dates exist
                                        if (startDate && endDate) handleDateChange(startDate, endDate);
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="start" className="text-right">{t.budgets.startDate}</Label>
                                <Input
                                    id="start"
                                    className="col-span-3"
                                    placeholder="DD/MM/YYYY"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        handleDateChange(e.target.value, endDate);
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="end" className="text-right">{t.budgets.endDate}</Label>
                                <Input
                                    id="end"
                                    className="col-span-3"
                                    placeholder="DD/MM/YYYY"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        handleDateChange(startDate, e.target.value);
                                    }}
                                />
                            </div>

                            {durationDays > 0 && (
                                <div className="col-span-4 bg-muted/50 p-3 rounded-md text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span>{t.budgets.duration}:</span>
                                        <span className="font-medium">{durationDays} {t.common.days}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t.budgets.estMonthlyLimit}:</span>
                                        <span className="font-medium">₹{Math.round(monthlyLimit).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddBudget}>{t.budgets.saveBudget}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* AI Tip Banner */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">{t.budgets.aiTipTitle}</h3>
                        <p className="text-xs text-muted-foreground">{t.budgets.aiTipText}</p>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{t.budgets.totalBudget}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-2xl font-bold">₹{budgets.reduce((acc, b) => acc + b.total, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{t.budgets.totalSpent}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-2xl font-bold">₹{budgets.reduce((acc, b) => acc + b.spent, 0).toLocaleString()}</div>
                        <span className="text-[10px] text-muted-foreground">
                            {Math.round((budgets.reduce((acc, b) => acc + b.spent, 0) / budgets.reduce((acc, b) => acc + b.total, 0)) * 100)}% {t.budgets.used}
                        </span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{t.budgets.remaining}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-2xl font-bold text-green-600">
                            ₹{(budgets.reduce((acc, b) => acc + b.total, 0) - budgets.reduce((acc, b) => acc + b.spent, 0)).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{t.budgets.atRisk}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-2xl font-bold text-red-500">{budgets.filter(b => b.risk).length}</div>
                        <span className="text-[10px] text-muted-foreground">{t.budgets.category}</span>
                    </CardContent>
                </Card>
            </div>

            {/* Category Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {budgets.map((budget, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-sm">{budget.name}</h3>
                                    <p className="text-xs text-muted-foreground">₹{budget.spent.toLocaleString()} of ₹{budget.total.toLocaleString()}</p>
                                </div>
                                {budget.risk ? (
                                    <Badge variant="destructive" className="text-[10px]">{t.budgets.atRisk}</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-none">{t.budgets.safe}</Badge>
                                )}
                            </div>
                            <Progress value={(budget.spent / budget.total) * 100} className={`h-2 ${budget.risk ? 'dark:bg-muted/30 [&>div]:dark:bg-red-500 bg-secondary [&>div]:bg-red-500' : 'dark:bg-muted/30 [&>div]:dark:bg-primary'}`} />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>{Math.round((budget.spent / budget.total) * 100)}% {t.budgets.used}</span>
                                <div>
                                    <span>₹{(budget.total - budget.spent).toLocaleString()} {t.budgets.left}</span>
                                    {budget.endDate && <span className="ml-2 border-l pl-2 text-xs">{budget.endDate}</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Budgets;
