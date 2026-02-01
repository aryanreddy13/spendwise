import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const Stocks = () => {
    const { t } = useTranslation();
    const [watchlist, setWatchlist] = useState([
        { symbol: "RELIANCE", price: 2980.50, change: 1.2, recommendation: "Buy" },
        { symbol: "TCS", price: 3890.00, change: -0.5, recommendation: "Hold" }
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const marketOverview = [
        { name: "NIFTY 50", value: "22,450.30", change: "+0.85%", trend: "up" },
        { name: "SENSEX", value: "73,980.15", change: "+0.78%", trend: "up" },
        { name: "BANK NIFTY", value: "47,890.00", change: "-0.12%", trend: "down" }
    ];

    const recommendations = [
        {
            id: 1,
            name: "Reliance Industries",
            symbol: "RELIANCE",
            badge: "Buy",
            confidence: "High",
            explanation: "Strong quarterly results and expansion in retail sector showing positive momentum.",
            trend: "Bullish"
        },
        {
            id: 2,
            name: "Tata Motors",
            symbol: "TATAMOTORS",
            badge: "Hold",
            confidence: "Medium",
            explanation: "EV sales volume stabilizing, wait for next quarter guidance.",
            trend: "Neutral"
        },
        {
            id: 3,
            name: "HDFC Bank",
            symbol: "HDFCBANK",
            badge: "Buy",
            confidence: "High",
            explanation: "Stock is undervalued compared to historical P/E ratios.",
            trend: "Bullish"
        },
        {
            id: 4,
            name: "Infosys",
            symbol: "INFY",
            badge: "Sell",
            confidence: "Low",
            explanation: "Global IT spending slowdown affecting deal pipeline.",
            trend: "Bearish"
        }
    ];

    const addToWatchlist = (stock: { symbol: string, badge: string }) => {
        if (watchlist.find(item => item.symbol === stock.symbol)) {
            toast.warning(t.stocks.alreadyInWatchlist, {
                duration: 2500,
            });
        } else {
            setWatchlist([...watchlist, {
                symbol: stock.symbol,
                price: 0,
                change: 0,
                recommendation: stock.badge
            }]);
            toast.success(t.stocks.addedToWatchlist, {
                duration: 2500,
            });
        }
    };

    const removeFromWatchlist = (symbol: string) => {
        setWatchlist(watchlist.filter(item => item.symbol !== symbol));
        toast.info(t.stocks.removedFromWatchlist);
    };

    const getBadgeLabel = (badge: string) => {
        if (badge === 'Buy') return t.predictions.buy;
        if (badge === 'Sell') return t.predictions.sell;
        return t.predictions.hold;
    };

    const getConfidenceLabel = (confidence: string) => {
        if (confidence === 'High') return t.stocks.high;
        if (confidence === 'Low') return t.stocks.low;
        return t.stocks.medium;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">{t.stocks.title}</h1>

            {/* Market Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                {marketOverview.map((market) => (
                    <Card key={market.name}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {market.name}
                            </CardTitle>
                            {market.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{market.value}</div>
                            <p className={`text-xs ${market.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                {market.change} {t.stocks.fromYesterday}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Stock Recommendations (Educational) */}
                <div className="md:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{t.stocks.educationalAnalysis}</h2>
                        <Badge variant="outline">{t.stocks.aiGenerated}</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {recommendations.map((stock) => (
                            <Card key={stock.id} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{stock.name}</CardTitle>
                                            <CardDescription>{stock.symbol}</CardDescription>
                                        </div>
                                        <Badge className={`${stock.badge === 'Buy' ? 'bg-green-500 hover:bg-green-600' :
                                            stock.badge === 'Sell' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'
                                            }`}>
                                            {getBadgeLabel(stock.badge)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{t.stocks.confidence}:</span>
                                            <span className={`font-medium ${stock.confidence === 'High' ? 'text-green-600' :
                                                stock.confidence === 'Low' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>{getConfidenceLabel(stock.confidence)}</span>
                                        </div>
                                        <div className="bg-muted p-2 rounded-md text-sm italic">
                                            "{stock.explanation}"
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                            size="sm"
                                            onClick={() => addToWatchlist(stock)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> {t.stocks.addToWatchlist}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* User Watchlist */}
                <div className="md:col-span-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.stocks.myWatchlist}</CardTitle>
                            <CardDescription>{t.stocks.trackFavorites}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex space-x-2">
                                <Input
                                    placeholder={t.stocks.stockSymbolPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button size="icon" disabled>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {watchlist.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div>
                                            <div className="font-semibold">{item.symbol}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.price > 0 ? `₹${item.price}` : t.stocks.tracking}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {getBadgeLabel(item.recommendation)}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                                onClick={() => removeFromWatchlist(item.symbol)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {watchlist.length === 0 && (
                                    <div className="text-center text-muted-foreground text-sm py-4">
                                        {t.stocks.emptyWatchlist}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t.stocks.disclaimerTitle}</AlertTitle>
                <AlertDescription>
                    {t.stocks.disclaimerText}
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default Stocks;
