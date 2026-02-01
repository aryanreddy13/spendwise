import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const CreditStressTest = () => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState([12]);
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">{t.creditTest.cardBalance}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">{t.creditTest.cardBalance}</Label>
              <Input type="number" placeholder={t.creditTest.cardBalancePlaceholder} defaultValue="50000" className="h-9" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">{t.creditTest.paymentBehavior}</Label>
              <RadioGroup defaultValue="minimum" className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="text-sm">{t.creditTest.fullPayment}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimum" id="minimum" />
                  <Label htmlFor="minimum" className="text-sm">{t.creditTest.minimumDue}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="missed" id="missed" />
                  <Label htmlFor="missed" className="text-sm">{t.creditTest.missedPayment}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground">{t.creditTest.duration}</Label>
                <span className="text-xs font-medium">{duration[0]} months</span>
              </div>
              <Slider value={duration} onValueChange={setDuration} min={1} max={24} step={1} className="py-1" />
            </div>

            <Button className="w-full h-9 mt-2" onClick={() => setShowResults(true)}>
              {t.creditTest.simulate}
            </Button>
          </CardContent>
        </Card>

        {showResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{t.creditTest.totalInterest}</p>
                  <p className="text-2xl font-bold text-destructive mt-1">₹18,450</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">{t.creditTest.damageMeter}</p>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs font-medium text-destructive mt-2">68% damage</p>
                </CardContent>
              </Card>
            </div>

            {/* One Decision That Ruined It - AI Detector */}
            <Card className="border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400">
                  {t.ai.oneDecisionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                <Badge variant="destructive" className="font-normal text-xs px-2 py-0.5">
                  {t.ai.payingMinimum}
                </Badge>

                <div>
                  <p className="text-sm font-bold text-red-900 dark:text-red-200">
                    {t.ai.responsibleFor.replace('{percent}', '62%')}
                  </p>
                  <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1 leading-relaxed">
                    {t.ai.minimumExplanation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Explanation Layer */}
            <div className="px-1">
              <details className="group">
                <summary className="text-[10px] font-medium text-muted-foreground cursor-pointer flex items-center gap-1 list-none opacity-70 hover:opacity-100 transition-opacity w-fit select-none">
                  <span className="border-b border-dashed border-muted-foreground">{t.insights.whyAmISeeing}</span>
                </summary>
                <p className="text-[10px] text-muted-foreground/80 mt-2 pl-2 border-l-2 border-primary/20 leading-relaxed max-w-sm animate-in slide-in-from-top-1 duration-200">
                  {t.ai.creditExplanation}
                </p>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditStressTest;
