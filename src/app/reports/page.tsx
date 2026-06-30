'use client';

import { useState } from 'react';
import { BarChart2, Download, FileText } from 'lucide-react';

type DateRange = '7d' | '30d' | '90d' | 'custom';

const ticketVolumeData = [
  { day: 'Mon', tickets: 42 },
  { day: 'Tue', tickets: 38 },
  { day: 'Wed', tickets: 51 },
  { day: 'Thu', tickets: 47 },
  { day: 'Fri', tickets: 39 },
  { day: 'Sat', tickets: 12 },
  { day: 'Sun', tickets: 8 },
];
const maxTickets = Math.max(...ticketVolumeData.map((d) => d.tickets));

const slaData = [
  { board: 'Service Desk', total: 95, met: 89, pct: 93.7 },
  { board: 'Security', total: 45, met: 41, pct: 91.1 },
  { board: 'Infrastructure', total: 32, met: 28, pct: 87.5 },
  { board: 'Access Mgmt', total: 55, met: 52, pct: 94.5 },
  { board: 'Onboarding', total: 31, met: 31, pct: 100 },
];

const techData = [
  { name: 'Sarah Chen', assigned: 45, resolved: 42, avg: '2.8h', satisfaction: 4.9 },
  { name: 'Mike Torres', assigned: 38, resolved: 35, avg: '3.2h', satisfaction: 4.7 },
  { name: 'Lisa Park', assigned: 41, resolved: 38, avg: '3.8h', satisfaction: 4.6 },
  { name: 'Tom Walsh', assigned: 36, resolved: 33, avg: '4.1h', satisfaction: 4.5 },
  { name: 'Alex Kim', assigned: 22, resolved: 18, avg: '5.2h', satisfaction: 4.3 },
];

const companyData = [
  { company: 'Harbor Solutions', tickets: 48, pct: 16.9 },
  { company: 'Pinnacle Group', tickets: 41, pct: 14.4 },
  { company: 'Summit Financial', tickets: 38, pct: 13.4 },
  { company: 'Acme Corp', tickets: 35, pct: 12.3 },
  { company: 'Meridian Tech', tickets: 29, pct: 10.2 },
];
const maxCompanyTickets = Math.max(...companyData.map((d) => d.tickets));

function pctColor(pct: number) {
  if (pct >= 95) return 'text-green-400';
  if (pct >= 85) return 'text-yellow-400';
  return 'text-red-400';
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="text-yellow-400 font-medium text-sm">
      ★{value.toFixed(1)}
    </span>
  );
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  const rangeOptions: { label: string; value: DateRange }[] = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Reports</h1>
            <p className="text-gray-400 text-sm">Analytics and performance metrics</p>
          </div>
        </div>
      </div>

      {/* Date Range + Export */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-[#161b27] border border-[#1e2535] rounded-lg p-1 gap-1">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateRange(opt.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                dateRange === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1e2535] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1e2535] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tickets', value: '284', sub: null },
          { label: 'Resolved', value: '241', sub: '84.8%' },
          { label: 'Avg Resolution', value: '3.4h', sub: null },
          { label: 'SLA Compliance', value: '94.2%', sub: null },
        ].map((m) => (
          <div key={m.label} className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            {m.sub && <p className="text-green-400 text-sm mt-0.5">{m.sub} resolution rate</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Section 1: Ticket Volume by Day */}
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Ticket Volume by Day</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Day
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Tickets
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider w-full">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {ticketVolumeData.map((row) => (
                <tr key={row.day} className="border-b border-[#1e2535] last:border-0">
                  <td className="py-2.5 text-gray-400 text-sm w-16">{row.day}</td>
                  <td className="py-2.5 text-gray-300 text-sm w-16">{row.tickets}</td>
                  <td className="py-2.5 pr-2">
                    <div className="h-5 bg-[#0f1117] rounded overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded transition-all"
                        style={{ width: `${(row.tickets / maxTickets) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: SLA Performance by Board */}
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">SLA Performance by Board</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Board
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Met
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  % Compliance
                </th>
              </tr>
            </thead>
            <tbody>
              {slaData.map((row) => (
                <tr key={row.board} className="border-b border-[#1e2535] last:border-0">
                  <td className="py-2.5 text-gray-300 text-sm">{row.board}</td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.total}</td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.met}</td>
                  <td className={`py-2.5 text-sm font-semibold ${pctColor(row.pct)}`}>
                    {row.pct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Technician Metrics */}
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Technician Metrics</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Assigned
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Resolved
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Avg Res.
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Satisfaction
                </th>
              </tr>
            </thead>
            <tbody>
              {techData.map((row) => (
                <tr key={row.name} className="border-b border-[#1e2535] last:border-0">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                        {row.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-gray-300 text-sm">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.assigned}</td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.resolved}</td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.avg}</td>
                  <td className="py-2.5">
                    <StarRating value={row.satisfaction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Top Companies by Ticket Volume */}
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">
            Top Companies by Ticket Volume
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Tickets
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  % of Total
                </th>
                <th className="text-left pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider w-32">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {companyData.map((row) => (
                <tr key={row.company} className="border-b border-[#1e2535] last:border-0">
                  <td className="py-2.5 text-gray-300 text-sm">{row.company}</td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.tickets}</td>
                  <td className="py-2.5 text-gray-400 text-sm">{row.pct}%</td>
                  <td className="py-2.5 pr-2">
                    <div className="h-4 bg-[#0f1117] rounded overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded"
                        style={{ width: `${(row.tickets / maxCompanyTickets) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
