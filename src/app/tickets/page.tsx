'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  List,
  LayoutGrid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Status =
  | 'Open'
  | 'In Progress'
  | 'Awaiting User'
  | 'Awaiting Approval'
  | 'Resolved';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type SLAStatus = 'OK' | 'WARN' | 'BREACH';

interface Ticket {
  id: string;
  title: string;
  company: string;
  status: Status;
  priority: Priority;
  board: string;
  assignee: string;
  sla: SLAStatus;
  updated: string;
}

const tickets: Ticket[] = [
  { id: 'TKT-1055', title: 'MFA not working after phone upgrade', company: 'Acme Corp', status: 'Open', priority: 'High', board: 'Security', assignee: 'Sarah Chen', sla: 'OK', updated: '5m ago' },
  { id: 'TKT-1054', title: 'New employee setup - John Martinez', company: 'BlueSky LLC', status: 'In Progress', priority: 'Medium', board: 'Onboarding', assignee: 'Mike Torres', sla: 'OK', updated: '12m ago' },
  { id: 'TKT-1053', title: 'Ransomware alert on workstation WS-042', company: 'Pinnacle Group', status: 'Open', priority: 'Critical', board: 'Security', assignee: 'Unassigned', sla: 'BREACH', updated: '23m ago' },
  { id: 'TKT-1052', title: 'QuickBooks license expired', company: 'Acme Corp', status: 'Awaiting User', priority: 'Low', board: 'Software', assignee: 'Lisa Park', sla: 'OK', updated: '1h ago' },
  { id: 'TKT-1051', title: 'Cannot print to HP LaserJet 3rd floor', company: 'Meridian Tech', status: 'Open', priority: 'Medium', board: 'Service Desk', assignee: 'Tom Walsh', sla: 'OK', updated: '2h ago' },
  { id: 'TKT-1050', title: 'VPN disconnects every 30 minutes', company: 'Summit Financial', status: 'In Progress', priority: 'High', board: 'Infrastructure', assignee: 'Sarah Chen', sla: 'WARN', updated: '3h ago' },
  { id: 'TKT-1049', title: 'Request admin rights for software install', company: 'BlueSky LLC', status: 'Awaiting Approval', priority: 'Medium', board: 'Security', assignee: 'Mike Torres', sla: 'OK', updated: '4h ago' },
  { id: 'TKT-1048', title: 'Outlook calendar not syncing', company: 'Coastal Dynamics', status: 'Open', priority: 'Low', board: 'Service Desk', assignee: 'Lisa Park', sla: 'OK', updated: '5h ago' },
  { id: 'TKT-1047', title: 'Network outage Building C', company: 'Pinnacle Group', status: 'In Progress', priority: 'Critical', board: 'Infrastructure', assignee: 'Tom Walsh', sla: 'BREACH', updated: '6h ago' },
  { id: 'TKT-1046', title: 'Request shared mailbox for sales team', company: 'Meridian Tech', status: 'Awaiting Approval', priority: 'Medium', board: 'Access Mgmt', assignee: 'Sarah Chen', sla: 'OK', updated: '8h ago' },
  { id: 'TKT-1045', title: 'Backup job failed 3 nights in a row', company: 'Summit Financial', status: 'Open', priority: 'High', board: 'Security', assignee: 'Unassigned', sla: 'WARN', updated: '10h ago' },
  { id: 'TKT-1044', title: 'Deploy new workstations x5', company: 'Acme Corp', status: 'In Progress', priority: 'Medium', board: 'Hardware', assignee: 'Mike Torres', sla: 'OK', updated: '12h ago' },
  { id: 'TKT-1043', title: 'Employee offboarding - Jane Doe', company: 'Coastal Dynamics', status: 'Open', priority: 'High', board: 'Onboarding', assignee: 'Lisa Park', sla: 'OK', updated: '1d ago' },
  { id: 'TKT-1042', title: 'SharePoint access denied', company: 'BlueSky LLC', status: 'Resolved', priority: 'Low', board: 'Access Mgmt', assignee: 'Sarah Chen', sla: 'OK', updated: '1d ago' },
  { id: 'TKT-1041', title: 'Phishing email reported', company: 'Meridian Tech', status: 'Open', priority: 'High', board: 'Security', assignee: 'Tom Walsh', sla: 'OK', updated: '2d ago' },
];

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    'Open': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'In Progress': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Awaiting User': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'Awaiting Approval': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'Resolved': 'bg-green-500/20 text-green-400 border border-green-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    'Critical': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'High': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Low': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function SLABadge({ sla }: { sla: SLAStatus }) {
  if (sla === 'OK') return <span className="text-green-400 text-xs font-medium">OK</span>;
  if (sla === 'WARN') return <span className="text-yellow-400 text-xs font-medium">WARN</span>;
  return <span className="text-red-400 text-xs font-semibold">BREACH</span>;
}

export default function TicketsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  const statuses = ['All', 'Open', 'In Progress', 'Awaiting User', 'Awaiting Approval', 'Resolved'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filtered = tickets.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const toggleTicket = (id: string) => {
    setSelectedTickets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allChecked) {
      setSelectedTickets(new Set());
      setAllChecked(false);
    } else {
      setSelectedTickets(new Set(filtered.map(t => t.id)));
      setAllChecked(true);
    }
  };

  const statsData = [
    { label: 'Open', value: 24, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'In Progress', value: 8, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Awaiting', value: 11, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Resolved Today', value: 6, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white/90">Ticket Queue</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and prioritize your team&apos;s workload</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsData.map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#161b27] border border-[#1e2535] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#161b27] border border-[#1e2535] rounded-lg px-4 py-2 pr-8 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="appearance-none bg-[#161b27] border border-[#1e2535] rounded-lg px-4 py-2 pr-8 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="ml-auto flex items-center gap-1 bg-[#161b27] border border-[#1e2535] rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e2535]">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="rounded border-gray-600 bg-[#0f1117] text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    {['#', 'Title', 'Company', 'Status', 'Priority', 'Board', 'Assignee', 'SLA', 'Updated'].map(col => (
                      <th key={col} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket, idx) => (
                    <tr
                      key={ticket.id}
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className={`border-b border-[#1e2535] last:border-0 cursor-pointer hover:bg-[#1e2535]/60 transition-colors ${idx % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedTickets.has(ticket.id)}
                          onChange={() => toggleTicket(ticket.id)}
                          className="rounded border-gray-600 bg-[#0f1117] text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-3 py-3 text-xs font-mono text-gray-400 whitespace-nowrap">{ticket.id}</td>
                      <td className="px-3 py-3 max-w-[260px]">
                        <span className="text-sm text-white/90 font-medium truncate block">{ticket.title}</span>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-300 whitespace-nowrap">{ticket.company}</td>
                      <td className="px-3 py-3"><StatusBadge status={ticket.status} /></td>
                      <td className="px-3 py-3"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-3 py-3 text-sm text-gray-400 whitespace-nowrap">{ticket.board}</td>
                      <td className="px-3 py-3 text-sm text-gray-300 whitespace-nowrap">{ticket.assignee}</td>
                      <td className="px-3 py-3 whitespace-nowrap"><SLABadge sla={ticket.sla} /></td>
                      <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{ticket.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                  <SLABadge sla={ticket.sla} />
                </div>
                <p className="text-sm text-white/90 font-medium mb-3 line-clamp-2 group-hover:text-white transition-colors">
                  {ticket.title}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{ticket.company}</span>
                  <span>{ticket.assignee}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#1e2535] flex items-center justify-between text-xs text-gray-600">
                  <span>{ticket.board}</span>
                  <span>{ticket.updated}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 px-1">
          <span className="text-sm text-gray-500">Showing 1–15 of 38 tickets</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg bg-[#161b27] border border-[#1e2535] text-gray-400 hover:text-white hover:border-indigo-500/50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#161b27] border border-[#1e2535] text-gray-400 hover:text-white hover:border-indigo-500/50'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="p-1.5 rounded-lg bg-[#161b27] border border-[#1e2535] text-gray-400 hover:text-white hover:border-indigo-500/50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
