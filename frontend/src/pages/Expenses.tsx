import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useTransactions } from '@/contexts/TransactionContext';
import { toast } from "sonner"
import { Plus, Search, Utensils, Bus, ShoppingBag, Receipt, Music, HelpCircle, FileText, Upload, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Expense {
    id: number;
    date: string;
    category: string;
    amount: number;
    note: string;
    attachment?: boolean;
}

const Expenses = () => {
    const { t } = useTranslation();
    const { transactions, addTransaction } = useTransactions();

    // Filter to show only expenses and bills in this view
    const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'bill')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate dynamic stats
    const totalExpensesSum = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
        const cat = t.category;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    });

    // Highest Category
    const highestCategoryKey = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, '');
    const highestCategoryAmount = categoryTotals[highestCategoryKey] || 0;
    const highestCategoryLabel = highestCategoryKey ? (t.expenses.categories[highestCategoryKey as keyof typeof t.expenses.categories] || highestCategoryKey) : 'None';

    // Top Categories
    const topCategories = Object.entries(categoryTotals)
        .map(([cat, val]) => ({
            label: t.expenses.categories[cat as keyof typeof t.expenses.categories] || cat,
            amount: `₹${val.toLocaleString()}`,
            percent: totalExpensesSum ? Math.round((val / totalExpensesSum) * 100) : 0,
            rawAmount: val
        }))
        .sort((a, b) => b.rawAmount - a.rawAmount)
        .slice(0, 3)
        .map((item, i) => ({
            ...item,
            color: ['bg-primary', 'bg-blue-500', 'bg-orange-500'][i] || 'bg-gray-500'
        }));


    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isAddBillOpen, setIsAddBillOpen] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
    const [newBill, setNewBill] = useState<Partial<Expense>>({});
    const [errors, setErrors] = useState<{ date?: string, amount?: string, category?: string }>({});

    const getIcon = (category: string) => {
        switch (category) {
            case 'food': return <Utensils className="h-4 w-4" />;
            case 'transport': return <Bus className="h-4 w-4" />;
            case 'shopping': return <ShoppingBag className="h-4 w-4" />;
            case 'bills': return <Receipt className="h-4 w-4" />;
            case 'entertainment': return <Music className="h-4 w-4" />;
            default: return <HelpCircle className="h-4 w-4" />;
        }
    };

    const handleAddBillStart = () => {
        setNewBill({ date: new Date().toISOString().split('T')[0] });
        setErrors({});
        setIsAddBillOpen(true);
    };

    const handleAddStart = () => {
        setNewExpense({ date: new Date().toISOString().split('T')[0] });
        setErrors({});
        setIsAddOpen(true);
    };

    const validateExpense = (expense: Partial<Expense>) => {
        const newErrors: typeof errors = {};
        if (!expense.amount) newErrors.amount = "Amount is required";
        if (!expense.category) newErrors.category = "Category is required";
        if (!expense.date) newErrors.date = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateExpense(newExpense)) return;

        addTransaction({
            date: newExpense.date!,
            category: newExpense.category!,
            amount: Number(newExpense.amount),
            note: newExpense.note || "",
            type: 'expense'
        });

        setIsAddOpen(false);

        // Indian Aunt Roast Logic
        const amount = Number(newExpense.amount);
        const category = newExpense.category!;

        // Strict Rule: Do NOT roast Bills
        if (category === 'bills') {
            toast.success("Expense added successfully");
            return;
        }

        let roast = "Paise ped pe nahi ugte. Thoda sambhal ke."; // Default

        if (category === 'food' && amount > 300) {
            roast = `₹${amount} on food? Ghar pe khana nahi milta kya?`;
        } else if (category === 'shopping' && amount > 1000) {
            roast = "Almirah already full beta, phir shopping?";
        } else if (category === 'transport' && amount > 500) {
            roast = "Itna ghoomna phirna? Padhai/Kaam pe dhyan do!";
        } else if (category === 'entertainment' && amount > 500) {
            roast = "Maze karne ke liye paise bachaye the?";
        }

        toast(roast, {
            description: "Indian Aunt says...",
            dismissible: true,
            duration: 4000,
        });
    };

    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const BILL_CATEGORIES = [
        "Electricity", "Water", "Gas", "Internet / WiFi", "Mobile Recharge",
        "Rent", "Insurance", "EMI / Loan", "Subscription", "Healthcare",
        "Education", "Other"
    ];

    const handleCategoryChange = (category: string) => {
        let description = "";
        switch (category) {
            case "Electricity": description = "Electricity Bill"; break;
            case "Water": description = "Water Bill"; break;
            case "Gas": description = "Gas Bill"; break;
            case "Internet / WiFi": description = "WiFi Bill"; break;
            case "Mobile Recharge": description = "Mobile Recharge"; break;
            case "Rent": description = "Monthly Rent"; break;
            case "Insurance": description = "Insurance Premium"; break;
            case "EMI / Loan": description = "Loan EMI"; break;
            case "Subscription": description = "Monthly Subscription"; break;
            case "Healthcare": description = "Medical Expense"; break;
            case "Education": description = "Education Fees"; break;
            default: description = "";
        }
        setNewBill({ ...newBill, category, note: description });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFileName(file.name);
            // In a real app, we would handle the file upload here
        }
    };

    const handleBillSubmit = () => {
        if (!newBill.amount || !newBill.category || !newBill.date) {
            toast.error("Please fill all required fields including Date.");
            return;
        }

        addTransaction({
            date: newBill.date, // already initialized
            category: "bills",
            // We use simple category for context, but could store subCategory in note or separate field if we extended context types
            // For now, storing subCategory as part of note or mapped category
            amount: Number(newBill.amount),
            note: newBill.note || newBill.category || "Monthly Bill",
            type: 'bill'
        });

        setIsAddBillOpen(false);
        setUploadedFileName(null);
        setNewBill({});

        // Simple success toast for BILLS
        toast.success(t.expenses.billAdded);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search expenses..." className="pl-9 h-9" />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={handleAddBillStart} className="gap-2 flex-1 md:flex-none">
                        <FileText className="h-4 w-4" /> {t.expenses.addBill}
                    </Button>
                    <Button onClick={handleAddStart} className="gap-2 flex-1 md:flex-none">
                        <Plus className="h-4 w-4" /> {t.expenses.addExpense}
                    </Button>
                </div>
            </div>

            {/* Smart Tip Banner */}
            <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/50">
                <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Smart Tip:</strong> You spent 20% less on transport this month. Great job sticking to the metro!
                    </p>
                </CardContent>
            </Card>

            {/* KPI Mini Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium">Highest Category</p>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-orange-500" />
                                <span className="font-bold capitalize">{highestCategoryLabel}</span>
                            </div>
                            <span className="text-sm font-bold">₹{highestCategoryAmount.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium">Total Transactions</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-2xl font-bold">{expenses.length}</span>
                            <Badge variant="secondary" className="text-[10px] text-green-600 bg-green-50">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +12%
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium">Daily Average</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-2xl font-bold">₹{(totalExpensesSum / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            <Badge variant="secondary" className="text-[10px] text-red-600 bg-red-50">
                                <ArrowDownRight className="h-3 w-3 mr-1" /> -5%
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Where your money goes */}
            <Card>
                <CardHeader className="p-4 py-3 border-b">
                    <CardTitle className="text-sm font-medium">Where your money goes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {topCategories.map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium">{item.label}</span>
                                <span className="text-muted-foreground">{item.amount} ({item.percent}%)</span>
                            </div>
                            <Progress value={item.percent} className={`h-2 dark:bg-muted/30 [&>div]:dark:${item.color.replace('bg-', 'bg-')} ${item.color.replace('bg-', '[&>div]:bg-')}`} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="p-4 py-3 border-b">
                    <CardTitle className="text-sm font-medium">{t.expenses.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[120px] text-xs h-10">{t.expenses.date}</TableHead>
                                <TableHead className="w-[140px] text-xs h-10">{t.expenses.category}</TableHead>
                                <TableHead className="text-xs h-10">{t.expenses.description}</TableHead>
                                <TableHead className="text-right text-xs h-10">{t.expenses.amount}</TableHead>
                                <TableHead className="w-[80px] text-center text-xs h-10">{t.expenses.attachment}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id} className="text-sm">
                                    <TableCell className="py-3 text-muted-foreground font-medium">{expense.date}</TableCell>
                                    <TableCell className="py-3">
                                        <Badge variant="outline" className="font-normal gap-1.5 py-0.5 pl-1 pr-2">
                                            {getIcon(expense.category)}
                                            <span className="capitalize">{t.expenses.categories[expense.category as keyof typeof t.expenses.categories] || expense.category}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3">{expense.note}</TableCell>
                                    <TableCell className="py-3 text-right font-bold dark:text-primary dark:drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">₹{expense.amount.toLocaleString()}</TableCell>
                                    <TableCell className="py-3 text-center">
                                        {expense.attachment && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <FileText className="h-3 w-3 text-muted-foreground" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Expense Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.expenses.addExpense}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.date} <span className="text-red-500">*</span></Label>
                            <div className="col-span-3">
                                <Input
                                    type="date"
                                    value={newExpense.date || ''}
                                    onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                />
                                {errors.date && <p className="text-[10px] text-red-500 mt-1">{errors.date}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.amount} <span className="text-red-500">*</span></Label>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    value={newExpense.amount || ''}
                                    onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                                />
                                {errors.amount && <p className="text-[10px] text-red-500 mt-1">{errors.amount}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.category} <span className="text-red-500">*</span></Label>
                            <div className="col-span-3">
                                <Select onValueChange={v => setNewExpense({ ...newExpense, category: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="food">{t.expenses.categories.food}</SelectItem>
                                        <SelectItem value="transport">{t.expenses.categories.transport}</SelectItem>
                                        <SelectItem value="shopping">{t.expenses.categories.shopping}</SelectItem>
                                        <SelectItem value="bills">{t.expenses.categories.bills}</SelectItem>
                                        <SelectItem value="entertainment">{t.expenses.categories.entertainment}</SelectItem>
                                        <SelectItem value="other">{t.expenses.categories.other}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-[10px] text-red-500 mt-1">{errors.category}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.description}</Label>
                            <Input
                                className="col-span-3"
                                value={newExpense.note || ''}
                                onChange={e => setNewExpense({ ...newExpense, note: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>{t.expenses.submit}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.expenses.addBill}</DialogTitle>
                        <DialogDescription>Upload a bill or invoice</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.date} <span className="text-red-500">*</span></Label>
                            <div className="col-span-3">
                                <Input
                                    type="date"
                                    value={newBill.date || ''}
                                    onChange={e => setNewBill({ ...newBill, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.category} <span className="text-red-500">*</span></Label>
                            <div className="col-span-3">
                                <Select onValueChange={handleCategoryChange}>
                                    <SelectTrigger className={!newBill.category ? "text-muted-foreground" : ""}>
                                        <SelectValue placeholder="Select Bill Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BILL_CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {!newBill.category && (
                                    <p className="text-[10px] text-red-500 mt-1 ml-1">Please select a bill category</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.amount} <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                className="col-span-3"
                                value={newBill.amount || ''}
                                placeholder="0.00"
                                onChange={e => setNewBill({ ...newBill, amount: Number(e.target.value) })}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{t.expenses.description}</Label>
                            <Input
                                className="col-span-3"
                                value={newBill.note || ''}
                                placeholder="Bill Description"
                                onChange={e => setNewBill({ ...newBill, note: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right mt-2">{t.expenses.attachment}</Label>
                            <div className="col-span-3">
                                <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    {uploadedFileName ? (
                                        <div className="flex flex-col items-center text-primary">
                                            <FileText className="h-6 w-6 mb-2" />
                                            <span className="font-medium text-xs break-all text-center">{uploadedFileName}</span>
                                            <span className="text-[10px] text-muted-foreground mt-1">Click to replace</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mb-2" />
                                            <span>Click to upload PDF/Image</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleBillSubmit}
                            disabled={!newBill.category || !newBill.amount}
                        >
                            {t.expenses.submit}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Expenses;
