import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const categories = [
  "מזון",
  "תחבורה",
  "דיור",
  "בילויים",
  "בריאות",
  "אחר",
  "חינוך",
  "תקשורת",
  "קניות",
  "תשלומים (חשבונות מים, חשמל וכו')",
  "ילדים",
  "הלוואות"
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4567",
  "#00A1E4",
  "#F78DA7",
  "#C4E538",
  "#A3CB38",
  "#FDA7DC",
  "#B53471"
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);

  const addExpense = () => {
    if (!amount || !date) return;
    setExpenses([...expenses, { amount: parseFloat(amount), category, date }]);
    setAmount("");
    setDate("");
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = income - total;

  const getRecommendation = () => {
    if (balance < 0) return "ההוצאות חורגות מההכנסות! שקול לצמצם קטגוריות מיותרות.";
    if (total > budget) return "חרגת מהתקציב שהגדרת. נסה להקטין הוצאות בקטגוריות מסוימות.";
    if (balance > income * 0.2) return "כל הכבוד! נשאר לך חיסכון יפה החודש.";

    const highSpendingCategories = categories.filter((cat) => {
      const totalInCategory = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return totalInCategory > total * 0.2;
    });

    if (highSpendingCategories.length > 0) {
      return `שים לב: הוצאות גבוהות במיוחד בקטגוריות: ${highSpendingCategories.join(", ")}. נסה לצמצם.`;
    }

    return "אתה במסגרת התקציב – המשך כך!";
  };

  const data = categories.map((cat) => {
    const value = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, value };
  });

  const monthlyData = Object.values(
    expenses.reduce((acc, e) => {
      const month = e.date?.slice(0, 7);
      if (!acc[month]) acc[month] = { month, amount: 0 };
      acc[month].amount += e.amount;
      return acc;
    }, {})
  ).sort((a, b) => a.month.localeCompare(b.month));

  const monthlyComparison = monthlyData.map((m) => ({
    ...m,
    income,
    balance: income - m.amount
  }));

  return (
    <div className="p-4 space-y-6 max-w-screen-sm mx-auto font-sans text-sm">
      <h1 className="text-3xl font-extrabold text-center text-blue-800 drop-shadow-md">
        🧾 אפליקציית מעקב הוצאות
      </h1>

      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Expense Tracker" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </div>
  );
}