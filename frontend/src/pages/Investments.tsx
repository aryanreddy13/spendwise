import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const Investments = () => {
    const { t } = useTranslation();
    const [investments, setInvestments] = useState<any[]>([]);

    useEffect(() => {
        api.get('/dashboard/investments').then(res => {
            setInvestments(res.data.investments || []);
        }).catch(console.error);
    }, []);

    const totalPortfolio = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    // Simple gain calculation based on annual return (assuming held for 1 year for demo or derived)
    const totalGains = investments.reduce((sum, inv) => sum + ((inv.amount || 0) * ((inv.annual_return || 0) / 100)), 0);
    const returnRate = totalPortfolio ? (totalGains / totalPortfolio) * 100 : 0;


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.nav.investments}</h1>
                <p className="text-muted-foreground mt-1">Track your investment portfolio and performance</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">₹{totalPortfolio.toLocaleString()}</div>
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Gains</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-green-600">+₹{totalGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Return Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-green-600">+{returnRate.toFixed(1)}%</div>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {investments.map((inv, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{inv.type || "Investment"}</p>
                                    <p className="text-sm text-muted-foreground">Rate: {inv.annual_return}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">₹{inv.amount.toLocaleString()}</p>
                                    <p className="text-sm text-green-600">+{inv.annual_return}%</p>
                                </div>
                            </div>
                        ))}
                        {investments.length === 0 && <p className="text-muted-foreground text-sm">No investments found.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Investments;
