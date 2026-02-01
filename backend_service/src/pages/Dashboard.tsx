import { useState } from 'react'; // Added useState
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SpendingTrendsChart } from '@/components/SpendingTrendsChart';
import { TrendingUp, TrendingDown, Target, Wallet, AlertTriangle, Sparkles, ArrowRight, X, Send } from 'lucide-react'; // Added X, Send
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import { useUser } from '@/contexts/UserContext';
import { useTransactions } from '@/contexts/TransactionContext'; // Import context
import { Link } from 'react-router-dom'; // Import Link

const Dashboard = () => {
  const { t } = useTranslation();
  const { name } = useUser();
  const { transactions } = useTransactions(); // Use context
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat state

  // diverse calculations
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'bill')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Simple hardcoded investments for now as no investments context yet (task focused on expenses/trends)
  const totalInvestments = 12400;

  return (
    <div className="space-y-6 relative">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t.dashboard.greeting} {name}
        </h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your financial overview.</p>
      </div>

      {/* 2. KPI Cards Row (4 cols) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Income */}
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          {/* No direct link for income in prompt, but good practice if page exists, else static */}
          <CardContent className="p-4 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-muted-foreground">Est. Income</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
              <span className="text-[10px] text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +5%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Expenses -> Click MUST navigate to /expenses */}
        <Link to="/expenses">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <CardContent className="p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-muted-foreground">Expenses</span>
                <TrendingDown className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {(totalIncome > 0 ? (totalExpenses / totalIncome * 100).toFixed(0) : 0)}% of income
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Investments -> Click MUST navigate to /investments */}
        <Link to="/investments">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <CardContent className="p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-muted-foreground">Investments</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹{totalInvestments.toLocaleString()}</div>
                <span className="text-[10px] text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12%
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Risk Score */}
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-muted-foreground">Risk Score</span>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">Medium</div>
              <span className="text-[10px] text-muted-foreground mt-1">
                Credit utilization: 45%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. AI Insight Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI Insight</h3>
              <p className="text-xs text-muted-foreground">Hey {name}, here's what we noticed: Your food spending is 15% higher than last month. Consider setting a tailored budget.</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 h-8 text-xs font-medium hover:bg-primary/20 hover:text-primary transition-colors"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            Ask Noob <ArrowRight className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>

      {/* 4. Month Summary Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 rounded-lg text-xs text-muted-foreground border border-border/50">
        <span>This Month: <strong className="text-foreground">Income ₹{totalIncome.toLocaleString()}</strong></span>
        <span className="h-3 w-[1px] bg-border mx-2"></span>
        <span><strong className="text-foreground">Expenses ₹{totalExpenses.toLocaleString()}</strong></span>
        <span className="h-3 w-[1px] bg-border mx-2"></span>
        <span><strong className="text-foreground">Investments ₹{totalInvestments.toLocaleString()}</strong></span>
        <span className="h-3 w-[1px] bg-border mx-2"></span>
        <span className="text-green-600 font-medium">Cashflow Positive</span>
      </div>

      {/* 5. Main Content Row (Spending Trends + Goals) */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Spending Trends (Wider) */}
        <Card className="md:col-span-2">
          <CardHeader className="p-4 py-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Spending Trends</CardTitle>
            {/* Toggles are now inside the chart component */}
          </CardHeader>
          <CardContent className="p-4 h-[300px] flex items-end">
            <SpendingTrendsChart />
          </CardContent>
        </Card>

        {/* Right: Goals Summary (Narrower) */}
        <Link to="/goals" className="block h-full"> {/* Wrapped in Link for better navigation if needed */}
          <Card className="h-full hover:bg-muted/5 transition-colors">
            <CardHeader className="p-4 py-3 border-b">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Goa Trip</span>
                  <span className="text-muted-foreground">₹12k / ₹30k</span>
                </div>
                <Progress value={40} className="h-2 dark:bg-muted/30 [&>div]:dark:bg-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">New MacBook</span>
                  <span className="text-muted-foreground">₹85k / ₹1.2L</span>
                </div>
                <Progress value={70} className="h-2 dark:bg-muted/30 [&>div]:dark:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Emergency Fund</span>
                  <span className="text-muted-foreground">₹20k / ₹1L</span>
                </div>
                <Progress value={20} className="h-2 dark:bg-muted/30 [&>div]:dark:bg-orange-500" />
              </div>

              <div className="pt-2 border-t mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Total Saved</span>
                  <span className="font-bold text-foreground">₹1.17L</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Floating Chatbot */}
      {isChatOpen && (
        <Card className="fixed bottom-6 right-6 w-80 shadow-2xl z-50 animate-in slide-in-from-bottom-5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Noob</CardTitle>
                <p className="text-[10px] text-muted-foreground">Your Money Buddy</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsChatOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="bg-muted/50 p-3 rounded-lg text-sm leading-relaxed border border-border/50">
              Hey {name} 👋 <br />
              I’m Noob 😄 <br />
              I’m not a finance guru, but I’ll help you understand your money better and make smarter decisions.
            </div>

            <div className="flex gap-2 pt-1">
              <Input placeholder="Type a message..." className="h-8 text-xs focus-visible:ring-1" />
              <Button size="icon" className="h-8 w-8 shrink-0">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Dashboard;
