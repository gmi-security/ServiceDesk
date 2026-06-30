import {
  Settings,
  Bot,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Zap,
  Users,
  Building2,
  Clock,
  TrendingUp,
  BarChart2,
  Database,
  Cpu,
  Webhook,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

const statsCards = [
  { label: 'Total Tickets', value: '1,284', icon: BarChart2, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { label: 'Open Tickets', value: '43', icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'SLA Compliance', value: '94.2%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { label: 'Avg Resolution', value: '3.4h', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { label: 'Active Technicians', value: '8', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { label: 'Companies', value: '24', icon: Building2, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
];

const barData = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 18 },
  { day: 'Wed', value: 24 },
  { day: 'Thu', value: 16 },
  { day: 'Fri', value: 21 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 6 },
];

const boardDistribution = [
  { name: 'Service Desk', pct: 35, color: 'bg-indigo-500' },
  { name: 'Security', pct: 22, color: 'bg-red-500' },
  { name: 'Infrastructure', pct: 18, color: 'bg-blue-500' },
  { name: 'Access Mgmt', pct: 15, color: 'bg-purple-500' },
  { name: 'Other', pct: 10, color: 'bg-gray-500' },
];

const slaTrendPoints = [
  { x: 0, y: 88 },
  { x: 1, y: 89 },
  { x: 2, y: 91 },
  { x: 3, y: 90 },
  { x: 4, y: 93 },
  { x: 5, y: 95 },
  { x: 6, y: 96 },
];

const activityFeed = [
  {
    icon: Bot,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-900/50 border-indigo-700/40',
    description: 'AI auto-resolved 3 password reset tickets',
    time: '5m ago',
  },
  {
    icon: AlertCircle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-900/30 border-red-700/40',
    description: 'SLA breach: TKT-1053 Ransomware alert',
    time: '23m ago',
  },
  {
    icon: CheckCircle,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-900/30 border-green-700/40',
    description: 'TKT-1047 Network outage resolved',
    time: '1h ago',
  },
  {
    icon: UserPlus,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-900/30 border-blue-700/40',
    description: 'New technician onboarded: Alex Kim',
    time: '2h ago',
  },
  {
    icon: Zap,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-900/30 border-purple-700/40',
    description: "n8n workflow 'Isolate-Workstation' executed",
    time: '3h ago',
  },
];

const systemHealth = [
  { name: 'Database', icon: Database, status: 'Online', color: 'text-green-400', dot: 'bg-green-400' },
  { name: 'AI Service', icon: Cpu, status: 'Online', color: 'text-green-400', dot: 'bg-green-400' },
  { name: 'n8n Webhooks', icon: Webhook, status: 'Online', color: 'text-green-400', dot: 'bg-green-400' },
  { name: 'Email Service', icon: Mail, status: 'Online', color: 'text-green-400', dot: 'bg-green-400' },
];

const quickLinks = [
  {
    label: 'Manage Users',
    description: 'Add, edit, and manage technician accounts',
    href: '/settings?tab=users',
    icon: Users,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50',
  },
  {
    label: 'Manage Boards',
    description: 'Configure workflow boards and columns',
    href: '/settings?tab=boards',
    icon: BarChart2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
  },
  {
    label: 'SLA Config',
    description: 'Set response and resolution SLA targets',
    href: '/settings?tab=sla',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50',
  },
  {
    label: 'Integration Settings',
    description: 'Manage API keys, webhooks, and n8n',
    href: '/settings?tab=integrations',
    icon: Webhook,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50',
  },
  {
    label: 'Audit Logs',
    description: 'Review system and user activity logs',
    href: '#',
    icon: Database,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10 border-gray-500/20 hover:border-gray-500/50',
  },
];

// SVG bar chart helpers
const BAR_MAX = 24;
const SVG_W = 320;
const SVG_H = 120;
const BAR_W = 30;
const BAR_GAP = (SVG_W - barData.length * BAR_W) / (barData.length + 1);

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-white/90">Admin Dashboard</h1>
            </div>
            <p className="text-gray-400 text-sm ml-12">System overview and configuration</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-400 text-xs leading-tight">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Bar Chart - Ticket Volume */}
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Ticket Volume (30d)</h2>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H + 30}`} className="w-full">
              {barData.map((d, i) => {
                const barH = Math.round((d.value / BAR_MAX) * SVG_H);
                const x = BAR_GAP + i * (BAR_W + BAR_GAP);
                const y = SVG_H - barH;
                return (
                  <g key={d.day}>
                    <rect
                      x={x}
                      y={y}
                      width={BAR_W}
                      height={barH}
                      rx={4}
                      className="fill-indigo-600 opacity-80"
                    />
                    <text
                      x={x + BAR_W / 2}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-gray-400"
                      fontSize={9}
                    >
                      {d.value}
                    </text>
                    <text
                      x={x + BAR_W / 2}
                      y={SVG_H + 14}
                      textAnchor="middle"
                      className="fill-gray-500"
                      fontSize={9}
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Board Distribution - Horizontal bars */}
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Board Distribution</h2>
            <div className="space-y-3">
              {boardDistribution.map(item => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{item.name}</span>
                    <span className="text-xs font-semibold text-gray-300">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#1e2535] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Trend - SVG polyline */}
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white/80 mb-4">SLA Trend</h2>
            <svg viewBox="0 0 280 130" className="w-full">
              {/* Grid lines */}
              {[80, 85, 90, 95, 100].map(v => {
                const y = 110 - ((v - 80) / 20) * 100;
                return (
                  <g key={v}>
                    <line x1={30} y1={y} x2={270} y2={y} stroke="#1e2535" strokeWidth={1} />
                    <text x={25} y={y + 3} textAnchor="end" className="fill-gray-600" fontSize={8}>{v}%</text>
                  </g>
                );
              })}
              {/* Polyline */}
              <polyline
                points={slaTrendPoints
                  .map(p => {
                    const px = 30 + (p.x / 6) * 240;
                    const py = 110 - ((p.y - 80) / 20) * 100;
                    return `${px},${py}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {/* Area fill */}
              <polyline
                points={[
                  ...slaTrendPoints.map(p => {
                    const px = 30 + (p.x / 6) * 240;
                    const py = 110 - ((p.y - 80) / 20) * 100;
                    return `${px},${py}`;
                  }),
                  '270,110',
                  '30,110',
                ].join(' ')}
                fill="#6366f1"
                fillOpacity={0.1}
              />
              {/* Dots */}
              {slaTrendPoints.map(p => {
                const px = 30 + (p.x / 6) * 240;
                const py = 110 - ((p.y - 80) / 20) * 100;
                return <circle key={p.x} cx={px} cy={py} r={3} fill="#6366f1" />;
              })}
              {/* Day labels */}
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                const px = 30 + (i / 6) * 240;
                return (
                  <text key={i} x={px} y={124} textAnchor="middle" className="fill-gray-600" fontSize={8}>{d}</text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Bottom Grid: Activity + Health + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Activity */}
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activityFeed.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center ${item.iconBg}`}>
                      <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 leading-snug">{item.description}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white/80 mb-4">System Health</h2>
            <div className="grid grid-cols-2 gap-3">
              {systemHealth.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="bg-[#1e2535] rounded-xl p-3 border border-[#2a3347]">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    </div>
                    <p className="text-sm font-medium text-white/80">{item.name}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${item.color}`}>{item.status}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Quick Links</h2>
            <div className="space-y-2">
              {quickLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${link.bg}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${link.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/90">{link.label}</p>
                      <p className="text-xs text-gray-500 truncate">{link.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
