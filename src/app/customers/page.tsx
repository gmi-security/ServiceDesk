'use client';

import { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Eye,
  Edit,
  ChevronRight,
  ChevronDown,
  Mail,
  MapPin,
  Ticket,
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  type: string;
  contacts: number;
  openTickets: number;
  slaTier: string;
  status: string;
  address: string;
  primaryContact: string;
  primaryEmail: string;
  recentTickets: { id: string; title: string; status: string }[];
}

const companies: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    type: 'SMB',
    contacts: 12,
    openTickets: 4,
    slaTier: 'Standard',
    status: 'Active',
    address: '123 Business Ave, Austin TX',
    primaryContact: 'John Smith',
    primaryEmail: 'john@acme.com',
    recentTickets: [
      { id: 'TKT-1041', title: 'Email not syncing on mobile', status: 'Open' },
      { id: 'TKT-1038', title: 'VPN connection drops intermittently', status: 'In Progress' },
    ],
  },
  {
    id: '2',
    name: 'BlueSky LLC',
    type: 'SMB',
    contacts: 6,
    openTickets: 2,
    slaTier: 'Standard',
    status: 'Active',
    address: '456 Cloud St, Denver CO',
    primaryContact: 'Amy Johnson',
    primaryEmail: 'amy@bluesky.com',
    recentTickets: [
      { id: 'TKT-1045', title: 'Printer offline on 2nd floor', status: 'Open' },
      { id: 'TKT-1033', title: 'Password reset request', status: 'Resolved' },
    ],
  },
  {
    id: '3',
    name: 'Pinnacle Group',
    type: 'Mid-Market',
    contacts: 34,
    openTickets: 7,
    slaTier: 'Premium',
    status: 'Active',
    address: '789 Summit Rd, Chicago IL',
    primaryContact: 'Robert Chen',
    primaryEmail: 'robert@pinnaclegroup.com',
    recentTickets: [
      { id: 'TKT-1052', title: 'SharePoint permissions issue', status: 'Open' },
      { id: 'TKT-1049', title: 'Laptop not booting', status: 'In Progress' },
    ],
  },
  {
    id: '4',
    name: 'Meridian Tech',
    type: 'SMB',
    contacts: 8,
    openTickets: 3,
    slaTier: 'Standard',
    status: 'Active',
    address: '321 Tech Blvd, Seattle WA',
    primaryContact: 'Diana Lee',
    primaryEmail: 'diana@meridiantech.com',
    recentTickets: [
      { id: 'TKT-1047', title: 'MFA setup assistance', status: 'Open' },
      { id: 'TKT-1044', title: 'New employee onboarding', status: 'In Progress' },
    ],
  },
  {
    id: '5',
    name: 'Summit Financial',
    type: 'Mid-Market',
    contacts: 45,
    openTickets: 5,
    slaTier: 'Premium',
    status: 'Active',
    address: '654 Finance Way, NYC NY',
    primaryContact: 'Mark Davis',
    primaryEmail: 'mark@summitfinancial.com',
    recentTickets: [
      { id: 'TKT-1055', title: 'Bloomberg terminal connectivity', status: 'Open' },
      { id: 'TKT-1053', title: 'Secure file transfer setup', status: 'Open' },
    ],
  },
  {
    id: '6',
    name: 'Coastal Dynamics',
    type: 'SMB',
    contacts: 5,
    openTickets: 2,
    slaTier: 'Basic',
    status: 'Active',
    address: '987 Ocean Dr, Miami FL',
    primaryContact: 'Lisa Torres',
    primaryEmail: 'lisa@coastaldynamics.com',
    recentTickets: [
      { id: 'TKT-1042', title: 'WiFi drops in conference room', status: 'Open' },
      { id: 'TKT-1039', title: 'Software license renewal', status: 'Resolved' },
    ],
  },
  {
    id: '7',
    name: 'Harbor Solutions',
    type: 'Enterprise',
    contacts: 120,
    openTickets: 12,
    slaTier: 'Enterprise',
    status: 'Active',
    address: '147 Harbor Blvd, Boston MA',
    primaryContact: 'James Wilson',
    primaryEmail: 'james@harborsolutions.com',
    recentTickets: [
      { id: 'TKT-1060', title: 'Data center cooling alert', status: 'Open' },
      { id: 'TKT-1058', title: 'Network switch replacement', status: 'In Progress' },
    ],
  },
  {
    id: '8',
    name: 'Nexus Digital',
    type: 'SMB',
    contacts: 4,
    openTickets: 1,
    slaTier: 'Basic',
    status: 'Active',
    address: '258 Digital Ave, Portland OR',
    primaryContact: 'Sarah Kim',
    primaryEmail: 'sarah@nexusdigital.com',
    recentTickets: [
      { id: 'TKT-1036', title: 'Domain email setup', status: 'Open' },
      { id: 'TKT-1030', title: 'Antivirus installation', status: 'Resolved' },
    ],
  },
];

function getSlaBadge(tier: string) {
  switch (tier) {
    case 'Basic':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
          Basic
        </span>
      );
    case 'Standard':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-300">
          Standard
        </span>
      );
    case 'Premium':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300">
          Premium
        </span>
      );
    case 'Enterprise':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900/50 text-purple-300">
          Enterprise
        </span>
      );
    default:
      return null;
  }
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
        </div>
        <p className="text-gray-400 ml-14">Manage companies and contacts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Companies', value: '24' },
          { label: 'Active', value: '21' },
          { label: 'New This Month', value: '3' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4"
          >
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161b27] border border-[#1e2535] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e2535]">
              <th className="w-10 px-4 py-3"></th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Company Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Contacts
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Open Tickets
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                SLA Tier
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => (
              <>
                <tr
                  key={company.id}
                  className="border-b border-[#1e2535] hover:bg-[#1a2030] transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRow(company.id)}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {expandedRow === company.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className="text-white font-medium">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{company.type}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{company.contacts}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-sm">{company.openTickets}</span>
                  </td>
                  <td className="px-4 py-3">{getSlaBadge(company.slaTier)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-900/40 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1e2535] rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1e2535] rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === company.id && (
                  <tr key={`${company.id}-expanded`} className="border-b border-[#1e2535]">
                    <td colSpan={8} className="px-4 py-4 bg-[#0f1117]/50">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Address */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                            Address
                          </p>
                          <div className="flex items-start gap-2 text-gray-300 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                            {company.address}
                          </div>
                        </div>
                        {/* Primary Contact */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                            Primary Contact
                          </p>
                          <p className="text-gray-300 text-sm font-medium mb-1">
                            {company.primaryContact}
                          </p>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                            {company.primaryEmail}
                          </div>
                        </div>
                        {/* Recent Tickets */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                            Recent Tickets
                          </p>
                          <div className="space-y-2">
                            {company.recentTickets.map((ticket) => (
                              <div
                                key={ticket.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Ticket className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                <span className="text-indigo-400 font-mono text-xs">
                                  {ticket.id}
                                </span>
                                <span className="text-gray-300 truncate">{ticket.title}</span>
                                <span
                                  className={`ml-auto shrink-0 text-xs px-1.5 py-0.5 rounded ${
                                    ticket.status === 'Open'
                                      ? 'bg-blue-900/40 text-blue-400'
                                      : ticket.status === 'In Progress'
                                      ? 'bg-yellow-900/40 text-yellow-400'
                                      : 'bg-green-900/40 text-green-400'
                                  }`}
                                >
                                  {ticket.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
