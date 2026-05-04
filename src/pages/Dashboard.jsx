import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  Database,
  Sparkles,
  BarChart2,
  Users,
  Settings,
  ChevronDown,
  Bell,
  Search,
  TrendingUp,
  DollarSign,
  Trophy,
  Percent,
  Snowflake,
  Wind,
  RefreshCw,
  Warehouse,
  Zap,
  Wrench,
  Clock,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "My estimates" },
  { icon: Database, label: "Data repository" },
  { icon: Sparkles, label: "AI insights" },
  { icon: BarChart2, label: "Reports" },
  { icon: Users, label: "Users & roles" },
  { icon: Settings, label: "Settings" },
];

const FORM_TYPES = [
  {
    code: "CR-01",
    name: "Commercial Refrigeration Installation",
    complexity: "Multi-tab",
    icon: Snowflake,
    highlight: true,
  },
  {
    code: "IR-02",
    name: "Industrial Refrigeration Systems",
    complexity: "Complex assembly",
    icon: Snowflake,
    highlight: false,
  },
  {
    code: "HV-03",
    name: "HVAC Infrastructure",
    complexity: "Multi-trade",
    icon: Wind,
    highlight: false,
  },
  {
    code: "SR-04",
    name: "System Retrofit & Replacement",
    complexity: "Replacement scope",
    icon: RefreshCw,
    highlight: false,
  },
  {
    code: "CS-05",
    name: "Cold Storage & Distribution",
    complexity: "Distribution",
    icon: Warehouse,
    highlight: false,
  },
  {
    code: "ES-06",
    name: "Energy Services",
    complexity: "Single-trade",
    icon: Zap,
    highlight: false,
  },
  {
    code: "SM-07",
    name: "Service & Maintenance",
    complexity: "Simple inputs",
    icon: Wrench,
    highlight: false,
  },
];

const STATUS_COLORS = {
  Draft: "bg-slate-100 text-slate-600",
  "In review": "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-blue-700",
  Won: "bg-emerald-100 text-emerald-700",
};

const TYPE_COLORS = {
  "CR-01": "bg-teal-600",
  "IR-02": "bg-sky-600",
  "HV-03": "bg-violet-600",
  "SR-04": "bg-orange-600",
  "CS-05": "bg-cyan-600",
  "ES-06": "bg-yellow-600",
  "SM-07": "bg-slate-500",
};

/** POC: open CR-01 estimate in layout variation A / B / C by form card. */
const FORM_DEMO_HREF = {
  "CR-01": "/form/a",
  "IR-02": "/form/b",
  "HV-03": "/form/c",
};

function formDemoHref(code) {
  return FORM_DEMO_HREF[code] ?? "/form/a";
}

const RECENT_ESTIMATES = [
  {
    typeCode: "CR-01",
    project: "Denver Cold Storage Expansion",
    formType: "Commercial Refrigeration Installation",
    updated: "2h ago",
    value: "$284,000",
    status: "In review",
  },
  {
    typeCode: "IR-02",
    project: "Phoenix Industrial Freeze Tunnel",
    formType: "Industrial Refrigeration Systems",
    updated: "Yesterday",
    value: "$1,140,000",
    status: "Draft",
  },
  {
    typeCode: "HV-03",
    project: "Chicago Distribution Hub HVAC",
    formType: "HVAC Infrastructure",
    updated: "3d ago",
    value: "$620,500",
    status: "Submitted",
  },
  {
    typeCode: "SR-04",
    project: "Seattle Supermarket Retrofit",
    formType: "System Retrofit & Replacement",
    updated: "5d ago",
    value: "$198,000",
    status: "Won",
  },
  {
    typeCode: "CS-05",
    project: "Atlanta Produce Distribution",
    formType: "Cold Storage & Distribution",
    updated: "1w ago",
    value: "$875,000",
    status: "Draft",
  },
];

const KPI_CARDS = [
  {
    label: "Active bids",
    value: "23",
    delta: "+4 this week",
    positive: true,
    icon: FileText,
  },
  {
    label: "Pipeline value",
    value: "$4.2M",
    delta: "+12% vs last quarter",
    positive: true,
    icon: DollarSign,
  },
  {
    label: "Win rate (90d)",
    value: "34%",
    delta: "-2pts vs prior period",
    positive: false,
    icon: Trophy,
  },
  {
    label: "Avg margin",
    value: "22.1%",
    delta: "+0.8pts vs target",
    positive: true,
    icon: Percent,
  },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-sm">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-slate-900 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#1D9E75] flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold tracking-tight text-base">
              Arcticom
            </span>
          </div>
        </div>

        {/* Company switcher */}
        <div className="px-3 py-3 border-b border-slate-700">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-xs">
            <span className="truncate">Arctic Pacific — West</span>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 ml-1 text-slate-400" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeNav === label
                  ? "bg-[#1D9E75] text-white"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* User chip */}
        <div className="px-3 py-4 border-t border-slate-700">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-xs font-semibold">
              JM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-100 text-xs font-medium truncate">
                Jamie Morales
              </p>
              <p className="text-slate-400 text-[10px] truncate">
                Senior Estimator
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-slate-800 flex-shrink-0">
            Dashboard
          </h1>
          <div className="flex-1 max-w-xs relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Search estimates, projects..."
              className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold">
              JM
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-4 mb-7">
            {KPI_CARDS.map(({ label, value, delta, positive, icon: Icon }) => (
              <Card key={label} className="border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {value}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <p
                    className={`text-[11px] mt-2 flex items-center gap-1 ${
                      positive ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {delta}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Start a new estimate */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">
                Start a new estimate
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {FORM_TYPES.map(
                ({ code, name, complexity, icon: Icon, highlight }) => (
                  <Link
                    key={code}
                    to={formDemoHref(code)}
                    className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75] focus-visible:ring-offset-2"
                  >
                  <Card
                    className={`cursor-pointer hover:shadow-md transition-all border h-full ${
                      highlight
                        ? "border-[#1D9E75] ring-1 ring-[#1D9E75]/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
                            highlight
                              ? "bg-[#1D9E75]/10"
                              : "bg-slate-100"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              highlight
                                ? "text-[#1D9E75]"
                                : "text-slate-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 leading-snug mb-1">
                            {name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                highlight
                                  ? "bg-[#1D9E75] text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {code}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {complexity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                )
              )}
            </div>
          </section>

          <Separator className="mb-7" />

          {/* Continue where you left off */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">
                Continue where you left off
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-[#1D9E75] h-7">
                View all
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-[11px] font-medium text-slate-400 px-4 py-3">
                        Project
                      </th>
                      <th className="text-left text-[11px] font-medium text-slate-400 px-4 py-3">
                        Form type
                      </th>
                      <th className="text-left text-[11px] font-medium text-slate-400 px-4 py-3">
                        Last updated
                      </th>
                      <th className="text-right text-[11px] font-medium text-slate-400 px-4 py-3">
                        Est. value
                      </th>
                      <th className="text-left text-[11px] font-medium text-slate-400 px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ESTIMATES.map((est, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${
                                TYPE_COLORS[est.typeCode]
                              }`}
                            >
                              {est.typeCode}
                            </span>
                            <span className="text-sm font-medium text-slate-700">
                              {est.project}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {est.formType}
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {est.updated}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                          {est.value}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                              STATUS_COLORS[est.status]
                            }`}
                          >
                            {est.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
