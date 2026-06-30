'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type SLAStatus = 'OK' | 'WARN' | 'BREACH';

interface KanbanTicket {
  id: string;
  title: string;
  priority: Priority;
  company: string;
  assigneeInitials: string;
  sla: SLAStatus;
}

interface KanbanColumn {
  id: string;
  name: string;
  tickets: KanbanTicket[];
}

const columns: KanbanColumn[] = [
  {
    id: 'new',
    name: 'New',
    tickets: [
      { id: 'TKT-1055', title: 'MFA not working after phone upgrade', priority: 'High', company: 'Acme Corp', assigneeInitials: 'SC', sla: 'OK' },
      { id: 'TKT-1051', title: 'Cannot print to HP LaserJet 3rd floor', priority: 'Medium', company: 'Meridian Tech', assigneeInitials: 'TW', sla: 'OK' },
    ],
  },
  {
    id: 'ai-triage',
    name: 'AI Triage',
    tickets: [
      { id: 'TKT-1053', title: 'Ransomware alert on workstation WS-042', priority: 'Critical', company: 'Pinnacle Group', assigneeInitials: '--', sla: 'BREACH' },
    ],
  },
  {
    id: 'awaiting-user',
    name: 'Awaiting User',
    tickets: [
      { id: 'TKT-1052', title: 'QuickBooks license expired', priority: 'Low', company: 'Acme Corp', assigneeInitials: 'LP', sla: 'OK' },
      { id: 'TKT-1048', title: 'Outlook calendar not syncing', priority: 'Low', company: 'Coastal Dynamics', assigneeInitials: 'LP', sla: 'OK' },
    ],
  },
  {
    id: 'awaiting-approval',
    name: 'Awaiting Approval',
    tickets: [
      { id: 'TKT-1049', title: 'Request admin rights for software install', priority: 'Medium', company: 'BlueSky LLC', assigneeInitials: 'MT', sla: 'OK' },
      { id: 'TKT-1046', title: 'Request shared mailbox for sales team', priority: 'Medium', company: 'Meridian Tech', assigneeInitials: 'SC', sla: 'OK' },
    ],
  },
  {
    id: 'assigned',
    name: 'Assigned',
    tickets: [
      { id: 'TKT-1044', title: 'Deploy new workstations x5', priority: 'Medium', company: 'Acme Corp', assigneeInitials: 'MT', sla: 'OK' },
      { id: 'TKT-1043', title: 'Employee offboarding - Jane Doe', priority: 'High', company: 'Coastal Dynamics', assigneeInitials: 'LP', sla: 'OK' },
    ],
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    tickets: [
      { id: 'TKT-1050', title: 'VPN disconnects every 30 minutes', priority: 'High', company: 'Summit Financial', assigneeInitials: 'SC', sla: 'WARN' },
      { id: 'TKT-1047', title: 'Network outage Building C', priority: 'Critical', company: 'Pinnacle Group', assigneeInitials: 'TW', sla: 'BREACH' },
    ],
  },
  {
    id: 'waiting-vendor',
    name: 'Waiting Vendor',
    tickets: [
      { id: 'TKT-1045', title: 'Backup job failed 3 nights in a row', priority: 'High', company: 'Summit Financial', assigneeInitials: '--', sla: 'WARN' },
    ],
  },
];

const boards = [
  'Service Desk',
  'Security',
  'Infrastructure',
  'Access Management',
  'Onboarding/Offboarding',
  'Automation',
  'Escalations',
  'Customer Success',
  'Internal GMI',
];

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    High: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function SLADot({ sla }: { sla: SLAStatus }) {
  const colors: Record<SLAStatus, string> = {
    OK: 'bg-green-400',
    WARN: 'bg-yellow-400',
    BREACH: 'bg-red-500',
  };
  return (
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[sla]}`}
      title={`SLA: ${sla}`}
    />
  );
}

export default function BoardsPage() {
  const router = useRouter();
  const [activeBoard, setActiveBoard] = useState('Service Desk');

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      <div className="px-6 pt-8 pb-0">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white/90">Boards</h1>
            <p className="text-gray-400 text-sm mt-0.5">Visual ticket management by workflow stage</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Board Tab Selector */}
        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex gap-1 min-w-max border-b border-[#1e2535] pb-0">
            {boards.map(board => (
              <button
                key={board}
                onClick={() => setActiveBoard(board)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeBoard === board
                    ? 'text-indigo-400 border-indigo-500'
                    : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                {board}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 py-3 mt-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-gray-400">12 Total Open</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-gray-400">2 Overdue</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-gray-400">Avg Age: 4.2h</span>
          </div>
        </div>
      </div>

      {/* Kanban Board - horizontal scroll */}
      <div className="flex-1 overflow-x-auto px-6 pb-8 pt-3">
        <div className="flex gap-4 min-w-max h-full items-start">
          {columns.map(col => (
            <div
              key={col.id}
              className="w-64 flex-shrink-0 bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#1e2535]">
                <span className="text-sm font-semibold text-white/80">{col.name}</span>
                <span className="text-xs font-bold text-gray-400 bg-[#1e2535] px-2 py-0.5 rounded-full min-w-[22px] text-center">
                  {col.tickets.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2">
                {col.tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    className="bg-[#1e2535] hover:bg-[#242d40] border border-[#2a3347] hover:border-indigo-500/30 rounded-lg p-3 cursor-pointer transition-all group"
                  >
                    <p className="text-xs text-gray-500 font-mono mb-1">{ticket.id}</p>
                    <p className="text-sm text-white/90 font-medium mb-2 leading-snug group-hover:text-white transition-colors line-clamp-2">
                      {ticket.title}
                    </p>
                    <div className="mb-2">
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{ticket.company}</p>
                    <div className="flex items-center justify-between">
                      {ticket.assigneeInitials !== '--' ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{ticket.assigneeInitials}</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-xs text-gray-500">?</span>
                        </div>
                      )}
                      <SLADot sla={ticket.sla} />
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {col.tickets.length === 0 && (
                  <div className="text-center py-6 text-gray-600 text-xs">No tickets</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
