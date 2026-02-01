import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlaceholderChart } from '@/components/PlaceholderChart';
import { AlertTriangle } from 'lucide-react';

const StockPredictor = () => {
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">{t.stocks.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">{t.stocks.stockSymbol}</Label>
              <Input placeholder={t.stocks.stockSymbolPlaceholder} defaultValue="RELIANCE" className="h-9" />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">{t.stocks.timeRange}</Label>
              <Select defaultValue="1month">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">{t.stocks.oneWeek}</SelectItem>
                  <SelectItem value="1month">{t.stocks.oneMonth}</SelectItem>
                  <SelectItem value="3months">{t.stocks.threeMonths}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full h-9" onClick={() => setShowResults(true)}>
              {t.stocks.analyze}
            </Button>
          </CardContent>
        </Card>

        {showResults && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.stocks.priceTrend}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 h-[150px]">
                <PlaceholderChart type="line" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">{t.predictions.prediction}</span>
                    <Badge className="w-fit bg-green-500 hover:bg-green-600 text-xs px-2 h-6">
                      {t.predictions.buy}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">{t.stocks.confidence}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-fit text-xs px-2 h-6 border-green-200 bg-green-50 text-green-700">{t.stocks.high}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Explanation - Mandatory Box */}
            <Card className="border-muted bg-muted/20">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.ai.whyThisRecommendation}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <ul className="text-xs space-y-1.5 text-foreground list-disc list-inside marker:text-muted-foreground">
                  <li>{t.ai.volatilityDetected}</li>
                  <li>{t.ai.weakMomentum}</li>
                  <li>{t.ai.priceReacting}</li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Explanation Layer */}
            <div className="px-1">
              <details className="group">
                <summary className="text-[10px] font-medium text-muted-foreground cursor-pointer flex items-center gap-1 list-none opacity-70 hover:opacity-100 transition-opacity w-fit select-none">
                  <span className="border-b border-dashed border-muted-foreground">{t.insights.whyAmISeeing}</span>
                </summary>
                <p className="text-[10px] text-muted-foreground/80 mt-2 pl-2 border-l-2 border-primary/20 leading-relaxed max-w-sm animate-in slide-in-from-top-1 duration-200">
                  {t.ai.stockExplanation}
                </p>
              </details>
            </div>

            <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
              <CardContent className="p-3 flex gap-3 items-start">
                <AlertTriangle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {t.ai.educationalInsight}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPredictor;
