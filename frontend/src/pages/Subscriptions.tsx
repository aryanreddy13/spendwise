import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const Subscriptions = () => {
    const { t } = useTranslation();

    const creditCards = [
        { name: "HDFC Regalia", limit: 500000, used: 45000, cycle: "15th - 14th", due: "4th Feb" },
        { name: "Amex Platinum", limit: 800000, used: 120000, cycle: "1st - 30th", due: "20th Feb" }
    ];

    const [subscriptions, setSubscriptions] = useState<any[]>([]);

    useEffect(() => {
        api.get('/dashboard/subscriptions').then(res => {
            const subs = res.data.subscriptions || [];
            // Map backend to UI
            const mapped = subs.map((sub: any) => ({
                id: sub.id,
                name: sub.name,
                amount: sub.cost,
                renewal: new Date(sub.nextRenewal).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                card: "Linked Card" // Backend doesn't store card info yet
            }));
            setSubscriptions(mapped);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">{t.subscriptions.title}</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Linked Credit Cards */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5" /> {t.common.linkedCreditCards}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {creditCards.map((card, i) => (
                            <Card key={i} className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none dark:from-gray-800 dark:to-gray-900">
                                <CardContent className="p-5 flex flex-col justify-between h-[180px]">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-lg">{card.name}</p>
                                            <p className="text-xs text-gray-400">**** **** **** 4582</p>
                                        </div>
                                        <div className="h-8 w-12 bg-white/10 rounded-md"></div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>{t.budgets.used}: ₹{card.used.toLocaleString()}</span>
                                                <span>{t.common.limit}: ₹{card.limit.toLocaleString()}</span>
                                            </div>
                                            <Progress value={(card.used / card.limit) * 100} className="h-1.5 bg-gray-700 [&>div]:bg-white" />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400 bg-white/5 p-2 rounded">
                                            <span>{t.common.cycle}: {card.cycle}</span>
                                            <span>{t.common.due}: {card.due}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Credit Insight */}
                    <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/50">
                        <CardContent className="p-4 flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">{t.common.creditUtilizationInsight}</h3>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    {t.common.creditUtilizationDesc}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscriptions List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" /> {t.common.activeSubscriptions}
                    </h2>
                    <div className="space-y-3">
                        {subscriptions.map((sub, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-sm">{sub.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">{sub.card}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">₹{sub.amount}</p>
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 mt-1 font-normal bg-muted">
                                                {t.common.renew}: {sub.renewal}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="w-full mt-3 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                                        {t.common.cancelBeforeRenewal}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
