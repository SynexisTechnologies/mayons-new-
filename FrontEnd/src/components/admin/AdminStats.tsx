import { TrendingUp, Package, DollarSign, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../api/apiConfig";

type Summary = {
  products?: number;
  soldPercentage?: number;
  itemsSold?: number;
  todayIncome?: number;
  daily?: number;
  weekly?: number;
  monthly?: number;
  yearly?: number;
  income?: number; // for date query
  totalOrders?: number;
};

export default function AdminStats() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const fetchSummary = async (date?: string) => {
    setLoading(true);
    try {
      // request summary for selected date if provided
      const params: any = {};
      if (date) params.date = date;

      const res = await axiosInstance.get("/orders/summary", { params });
      const data = res.data;

      // backend returns different shapes for date queries (income, itemsSold, totalOrders)
      const normalized: Summary = {
        products: data.products ?? data.data?.products ?? null,
        soldPercentage: data.soldPercentage ?? data.data?.soldPercentage ?? null,
        itemsSold: data.itemsSold ?? data.itemsSold ?? data.data?.itemsSold ?? data.itemsSold ?? null,
        todayIncome: data.todayIncome ?? data.daily ?? null,
        daily: data.daily ?? null,
        weekly: data.weekly ?? null,
        monthly: data.monthly ?? null,
        yearly: data.yearly ?? null,
        income: data.income ?? data.income ?? null,
        totalOrders: data.totalOrders ?? null,
      };

      setSummary(normalized);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch admin summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedDate);
    const id = setInterval(() => fetchSummary(selectedDate), 10000); // refresh every 10s
    return () => clearInterval(id);
  }, [selectedDate]);

  const selectedDayIncome = useMemo(() => {
    if (!summary) return 0;
    return summary.income ?? summary.todayIncome ?? summary.daily ?? 0;
  }, [summary]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Admin Summary</h3>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Products" value={summary?.products ?? 0} icon={<Package />} />
        <Card title="Sold Out %" value={`${summary?.soldPercentage ?? 0}%`} icon={<TrendingUp />} />
        <Card title="Items Sold" value={summary?.itemsSold ?? 0} icon={<Package />} />
        <Card title="Selected Day Income" value={`Rs ${selectedDayIncome || 0}`} icon={<DollarSign />} />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <SalesCard label="Daily" value={summary?.daily ?? summary?.todayIncome ?? 0} />
        <SalesCard label="Weekly" value={summary?.weekly ?? 0} />
        <SalesCard label="Monthly" value={summary?.monthly ?? 0} />
        <SalesCard label="Yearly" value={summary?.yearly ?? 0} />
      </div>
    </>
  );
}

function Card({ title, value, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{title}</p>
        <h2 className="text-2xl font-extrabold text-[#1e3a5f]">{value}</h2>
      </div>
      <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/8 flex items-center justify-center text-[#d4af37]">{icon}</div>
    </div>
  );
}

function SalesCard({ label, value }: any) {
  return (
    <div className="bg-[#1e3a5f] text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">{label} Sales</p>
      <h2 className="text-xl font-extrabold text-[#d4af37]">Rs {value || 0}</h2>
    </div>
  );
}
