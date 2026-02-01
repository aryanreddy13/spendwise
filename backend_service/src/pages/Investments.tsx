import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const Investments = () => {
    const { t } = useTranslation();

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
                            <div className="text-2xl font-bold">₹2,45,000</div>
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
                            <div className="text-2xl font-bold text-green-600">+₹45,000</div>
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
                            <div className="text-2xl font-bold text-green-600">+22.5%</div>
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
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">RELIANCE</p>
                                <p className="text-sm text-muted-foreground">50 shares</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹1,25,000</p>
                                <p className="text-sm text-green-600">+12.5%</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">TCS</p>
                                <p className="text-sm text-muted-foreground">30 shares</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹1,20,000</p>
                                <p className="text-sm text-green-600">+18.2%</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Investments;
