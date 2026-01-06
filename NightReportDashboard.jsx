import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart 
} from 'recharts';
import { 
  Calendar, DollarSign, Moon, ArrowUpRight, ArrowDownRight, Scissors, 
  Briefcase, Wallet, Receipt, Printer, Filter, Landmark, LayoutDashboard, 
  Table2, PieChart as PieIcon, ChevronDown 
} from 'lucide-react';

// --- DATA ---
const rawDailyData = [
  { date: '01 Jan', tariff: 212236.84, fbNet: 51866.46, fbGross: 57724.72, fbAllowance: 5858.26, otherSales: 3.34, collections: 80138, advance: 6000, advanceCash: 0, advanceCard: 6000, cash: 19326, card: 35589, company: 25223, hold: 0, taxes: 13205.38, paidOut: 221, excessShort: 5858.26 },
  { date: '02 Jan', tariff: 221251.95, fbNet: 37246.15, fbGross: 41747.61, fbAllowance: 4501.46, otherSales: 82.86, collections: 66589, advance: 13984, advanceCash: 0, advanceCard: 13984, cash: 10040, card: 8106, company: 47263, hold: 1180, taxes: 12939.46, paidOut: 0, excessShort: 4501.86 },
  { date: '03 Jan', tariff: 215104.98, fbNet: 35426.50, fbGross: 36811.62, fbAllowance: 1385.12, otherSales: 944.98, collections: 95164, advance: 8750, advanceCash: 3500, advanceCard: 5250, cash: 9582, card: 48261, company: 37321, hold: 0, taxes: 12696.10, paidOut: 0, excessShort: 1385.32 },
  { date: '04 Jan', tariff: 198711.11, fbNet: 95294.28, fbGross: 99125.70, fbAllowance: 3831.42, otherSales: 2.68, collections: 174051, advance: 10745, advanceCash: 2000, advanceCard: 8745, cash: 4180, card: 39087, company: 101174, hold: 29610, taxes: 14700.64, paidOut: 0, excessShort: 3831.42 },
  { date: '05 Jan', tariff: 189926.41, fbNet: 35650.05, fbGross: 36400.18, fbAllowance: 750.13, otherSales: 505.53, collections: 350956, advance: 28838, advanceCash: 0, advanceCard: 28838, cash: 44699, card: 39330, company: 233981, hold: 32946, taxes: 13241.04, paidOut: 0, excessShort: 750.13 }
];

const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

// --- UI COMPONENTS ---

const Card = ({ title, value, subtext, icon: Icon, trend, status }) => {
  const statusColors = {
    danger: 'text-rose-600 bg-rose-50',
    warning: 'text-amber-600 bg-amber-50',
    info: 'text-blue-600 bg-blue-50',
    default: 'text-indigo-600 bg-indigo-50'
  };
  
  const theme = statusColors[status] || statusColors.default;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${theme}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(value)}</h3>
        {subtext && <p className="text-slate-400 text-sm mt-2 font-medium">{subtext}</p>}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active 
        ? 'text-slate-900 bg-white shadow-sm ring-1 ring-slate-200' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
    <span>{label}</span>
  </button>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
  </div>
);

export default function NightReportDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState('All');

  // Logic
  const dailyData = useMemo(() => selectedDate === 'All' ? rawDailyData : rawDailyData.filter(d => d.date === selectedDate), [selectedDate]);
  
  const mtdTotals = useMemo(() => dailyData.reduce((acc, day) => ({
    tariff: acc.tariff + day.tariff,
    fbNet: acc.fbNet + day.fbNet,
    fbGross: acc.fbGross + day.fbGross,
    fbAllowance: acc.fbAllowance + day.fbAllowance,
    collections: acc.collections + day.collections,
    advance: acc.advance + day.advance,
    advanceCash: acc.advanceCash + day.advanceCash,
    advanceCard: acc.advanceCard + day.advanceCard,
    cash: acc.cash + day.cash,
    card: acc.card + day.card,
    company: acc.company + day.company,
    hold: acc.hold + day.hold,
    taxes: acc.taxes + day.taxes,
    excessShort: acc.excessShort + day.excessShort
  }), { tariff: 0, fbNet: 0, fbGross: 0, fbAllowance: 0, collections: 0, advance: 0, advanceCash: 0, advanceCard: 0, cash: 0, card: 0, company: 0, hold: 0, taxes: 0, excessShort: 0 }), [dailyData]);

  const availableDates = ['All', ...rawDailyData.map(d => d.date)];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 print:bg-white">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-4 py-4 print:hidden">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-indigo-200">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">Night<span className="text-indigo-600">Audit</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
              <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Overview" />
              <TabButton active={activeTab === 'treasury'} onClick={() => setActiveTab('treasury')} icon={PieIcon} label="Treasury" />
              <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={Table2} label="Records" />
            </div>

            <div className="hidden md:flex items-center">
              <div className="relative group">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <select 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    {availableDates.map(date => (
                      <option key={date} value={date}>{date === 'All' ? 'All Dates' : date}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 print:mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'treasury' ? 'Treasury & Risk' : 'Detailed Records'}
            </h1>
            <p className="text-slate-500 font-medium mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Reporting Period: {selectedDate === 'All' ? 'Jan 01 - Jan 05, 2026' : `${selectedDate}, 2026`}
            </p>
          </div>
          <button onClick={() => window.print()} className="group flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100 print:hidden">
            <Printer className="w-4 h-4" />
            <span className="text-sm font-bold">Print Report</span>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card title="Room Tariff" value={mtdTotals.tariff} icon={Moon} subtext="Total Room Revenue" trend={selectedDate === 'All' ? 12 : undefined} />
              <Card title="F&B Revenue" value={mtdTotals.fbNet} icon={UtensilsIcon} subtext="Net Sales" trend={selectedDate === 'All' ? -5 : undefined} />
              <Card title="Collections" value={mtdTotals.collections} icon={DollarSign} subtext="Total Inflow" trend={selectedDate === 'All' ? 24 : undefined} />
              <Card title="F&B Allowances" value={mtdTotals.fbAllowance} icon={Scissors} subtext="Voids & Discounts" status={mtdTotals.fbAllowance > 2000 ? 'danger' : 'default'} />
            </div>

            {/* Main Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <SectionHeader title="Revenue Performance" subtitle="Room Tariff vs F&B Net Sales vs Allowances" />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTariff" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `₹${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                        formatter={(value) => formatCurrency(value)} 
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="fbNet" name="F&B Net" barSize={32} fill="#10b981" radius={[6, 6, 6, 6]} />
                      <Bar dataKey="fbAllowance" name="Allowances" barSize={32} fill="#f43f5e" radius={[6, 6, 6, 6]} />
                      <Area type="monotone" dataKey="tariff" name="Room Tariff" stroke="#6366f1" strokeWidth={3} fill="url(#colorTariff)" dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#6366f1' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <SectionHeader title="Audit Discrepancies" subtitle="Excess / Short Trends" />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorExcess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="excessShort" stroke="#f59e0b" strokeWidth={3} fill="url(#colorExcess)" dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#f59e0b' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'treasury' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <Card title="Bills on Hold" value={mtdTotals.hold} icon={Receipt} subtext="Pending Settlement" status={mtdTotals.hold > 0 ? 'warning' : 'default'} />
               <Card title="Tax Liability" value={mtdTotals.taxes} icon={Landmark} subtext="GST Collected" status="info" />
               <Card title="Company Billing" value={mtdTotals.company} icon={Briefcase} subtext="Credit Sales" status="default" />
               <Card title="Total Advance" value={mtdTotals.advance} icon={Wallet} subtext="Deposits Held" status="default" />
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <SectionHeader title="Hold Analysis" subtitle="Unsettled Folios Trend" />
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={(value) => formatCurrency(value)} cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="hold" name="Bills on Hold" fill="#f97316" radius={[8, 8, 8, 8]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <SectionHeader title="Revenue Stack" subtitle="Composition by Department" />
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRoom" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorFbNet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={(value) => formatCurrency(value)} />
                                <Area type="monotone" dataKey="tariff" name="Room Tariff" stackId="1" stroke="#6366f1" fill="url(#colorRoom)" strokeWidth={2} />
                                <Area type="monotone" dataKey="fbNet" name="F&B Net" stackId="1" stroke="#10b981" fill="url(#colorFbNet)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
             </div>
           </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6 text-right">Tariff</th>
                    <th className="px-8 py-6 text-right">F&B Net</th>
                    <th className="px-8 py-6 text-right text-slate-400">Other</th>
                    <th className="px-8 py-6 text-right font-bold text-slate-700 bg-slate-50/50">Collections</th>
                    <th className="px-8 py-6 text-right text-orange-600">On Hold</th>
                    <th className="px-8 py-6 text-right text-blue-600">Advance</th>
                    <th className="px-8 py-6 text-right">Excess/Short</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dailyData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5 font-semibold text-slate-900">{row.date}</td>
                      <td className="px-8 py-5 text-right text-slate-600 font-medium">{formatCurrency(row.tariff)}</td>
                      <td className="px-8 py-5 text-right text-slate-600 font-medium">{formatCurrency(row.fbNet)}</td>
                      <td className="px-8 py-5 text-right text-slate-400 font-medium">{formatCurrency(row.otherSales)}</td>
                      <td className="px-8 py-5 text-right font-bold text-slate-900 bg-slate-50/30 group-hover:bg-indigo-50/30 transition-colors">{formatCurrency(row.collections)}</td>
                      <td className="px-8 py-5 text-right text-orange-600 font-bold">{formatCurrency(row.hold)}</td>
                      <td className="px-8 py-5 text-right text-blue-600 font-medium">{formatCurrency(row.advance)}</td>
                      <td className="px-8 py-5 text-right text-slate-600 font-medium">{formatCurrency(row.excessShort)}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50/30 font-bold text-indigo-900 border-t border-indigo-100">
                    <td className="px-8 py-6">Total</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.tariff)}</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.fbNet)}</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.otherSales)}</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.collections)}</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.hold)}</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.advance)}</td>
                    <td className="px-8 py-6 text-right">{formatCurrency(mtdTotals.excessShort)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Icon Wrapper
function UtensilsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
  );
}
