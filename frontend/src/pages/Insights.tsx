import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

const Insights = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Insights & Analytics</h1>
                <p className="text-muted-foreground mt-1">AI-generated insights based on your real spending</p>
            </div>

            {/* Top Status Strip */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">1</div>
                            <div className="text-sm font-medium text-muted-foreground">Positive trends this month</div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className="bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/20 shadow-none cursor-pointer hover:shadow-md transition-all group"
                    onClick={() => navigate('/budgets')}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground group-hover:text-orange-600 transition-colors">1</div>
                            <div className="text-sm font-medium text-muted-foreground">Areas needing attention</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insight Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* 1. Over Budget Alert */}
                <Card
                    className="overflow-hidden border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate('/budgets')}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Over Budget Alert
                            </h3>
                            <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Over by ₹3,800</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                            You have exceeded your planned budget by <strong>₹3,800</strong>.
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Subscription Costs */}
                <Card
                    className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate('/subscriptions')}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400 group-hover:underline decoration-blue-300 underline-offset-4">
                                Subscription Costs
                            </h3>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">₹2,494/mo</Badge>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-muted-foreground text-sm">
                                You are spending <strong>₹2,494</strong> monthly on subscriptions.
                            </p>
                            <ArrowRight className="h-4 w-4 text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                    </CardContent>
                </Card>

                {/* 3. High Savings Rate */}
                <Card
                    className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate('/expenses')}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-green-600 dark:text-green-400 group-hover:text-green-700 transition-colors">
                                High Savings Rate
                            </h3>
                            <div className="text-xl font-bold text-green-700 dark:text-green-400">90%</div>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            You are saving <strong>90%</strong> of your income. Keep it up!
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Financial Wellness */}
                <Card className="overflow-hidden border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-2">
                            Financial Wellness
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Review your detailed spending in the Budgets tab to find more opportunities to save.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Summary Overview */}
            <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                        <h3 className="font-semibold text-lg">Monthly Summary Overview</h3>
                        <span className="text-xs text-muted-foreground italic">*Income is estimated based on expenses for demonstration</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Est. Income</p>
                            <p className="text-2xl font-bold tracking-tight">₹60,000</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Expenses</p>
                            <p className="text-2xl font-bold tracking-tight text-red-500">₹6,294</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Savings</p>
                            <p className="text-2xl font-bold tracking-tight text-green-600">₹53,706</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Savings Rate</p>
                            <p className="text-2xl font-bold tracking-tight text-blue-600">90%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
export default Insights;
