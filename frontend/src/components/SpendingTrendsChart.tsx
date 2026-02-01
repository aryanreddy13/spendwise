import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export const SpendingTrendsChart = () => {
    // State for toggles
    const [showExpense, setShowExpense] = useState(true);
    const [showIncome, setShowIncome] = useState(false);

    // Fetched data state
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/dashboard/history');
                const history = res.data.history || [];
                // Map backend format (month, income, expense) to chart format (name, inc, exp)
                const mappedData = history.map((item: any) => ({
                    name: item.month,
                    inc: item.income,
                    exp: item.expense
                }));
                setData(mappedData);
            } catch (err) {
                console.error("Failed to fetch spending trends", err);
            }
        };
        fetchHistory();
    }, []);

    // Fallback if no data yet (don't show empty chart, maybe show loading or empty)
    // For now, if data is empty, Recharts handles it, or we can leave it empty.


    return (
        <div className="w-full h-full flex flex-col">
            {/* Toggles */}
            <div className="flex justify-end gap-2 mb-2">
                <button
                    onClick={() => setShowIncome(!showIncome)}
                    className={cn(
                        "text-[10px] px-3 py-1 rounded-full border transition-all duration-200",
                        showIncome
                            ? "bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900"
                            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted"
                    )}
                >
                    Income
                </button>
                <button
                    onClick={() => setShowExpense(!showExpense)}
                    className={cn(
                        "text-[10px] px-3 py-1 rounded-full border transition-all duration-200",
                        showExpense
                            ? "bg-green-100/50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
                            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted"
                    )}
                >
                    Expense
                </button>
            </div>

            {/* Graph */}
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            strokeOpacity={0.1}
                            stroke="currentColor"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ padding: 0 }}
                            formatter={(value: number, name: string) => [
                                `₹${value.toLocaleString()}`,
                                name === 'inc' ? 'Income' : 'Expense'
                            ]}
                            labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                        />

                        {/* Income Line (Secondary) - Muted Blue */}
                        {showIncome && (
                            <Line
                                type="monotone"
                                dataKey="inc"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                                animationDuration={1000}
                            />
                        )}

                        {/* Expense Line (Primary) - Green */}
                        {showExpense && (
                            <Line
                                type="monotone"
                                dataKey="exp"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1000}
                                style={{ filter: 'drop-shadow(0px 4px 6px rgba(34, 197, 94, 0.2))' }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Caption */}
            <div className="text-center mt-4">
                <p className="text-[10px] text-muted-foreground font-medium">
                    Monthly income vs expenses trend
                </p>
            </div>
        </div>
    );
}
