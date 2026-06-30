'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Puzzle,
  Clock,
  Layout,
  Users,
  Shield,
  GripVertical,
  Edit,
  Trash2,
} from 'lucide-react';

type Tab =
  | 'general'
  | 'notifications'
  | 'integrations'
  | 'sla'
  | 'boards'
  | 'users'
  | 'security';

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'integrations', label: 'Integrations', icon: <Puzzle className="w-4 h-4" /> },
  { id: 'sla', label: 'SLA Rules', icon: <Clock className="w-4 h-4" /> },
  { id: 'boards', label: 'Boards', icon: <Layout className="w-4 h-4" /> },
  { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function InputField({
  label,
  defaultValue,
  type = 'text',
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full bg-[#0f1117] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
      />
    </div>
  );
}

function GeneralTab() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">General Settings</h2>
      <div className="space-y-5 max-w-lg">
        <InputField label="App Name" defaultValue="GMI ServiceOS" />
        <InputField label="Support Email" defaultValue="support@gmi.com" type="email" />
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Timezone</label>
          <select className="w-full bg-[#0f1117] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Central European Time (CET)</option>
            <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Logo</label>
          <div className="border-2 border-dashed border-[#1e2535] rounded-xl p-8 text-center hover:border-indigo-600/50 transition-colors cursor-pointer">
            <p className="text-gray-400 text-sm mb-1">Click to upload or drag and drop</p>
            <p className="text-gray-600 text-xs">PNG, JPG, SVG up to 2MB</p>
          </div>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">Notifications</h2>
      <div className="space-y-4 max-w-lg">
        {[
          'Email on new ticket assignment',
          'Email on ticket status change',
          'Email on SLA breach warning',
          'Email on SLA breach',
          'Push notification on ticket assignment',
          'Daily digest summary',
        ].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-3 border-b border-[#1e2535]"
          >
            <span className="text-gray-300 text-sm">{item}</span>
            <Toggle enabled={true} onChange={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [cwEnabled, setCwEnabled] = useState(true);
  const [snEnabled, setSnEnabled] = useState(false);
  const [ssoCwEnabled, setSsoEnabled] = useState(true);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">Integrations</h2>
      <div className="space-y-4 max-w-2xl">
        {/* ConnectWise PSA */}
        <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900/30 border border-blue-800/40 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">CW</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">ConnectWise PSA</p>
                <p className="text-gray-500 text-xs">Professional Services Automation</p>
              </div>
            </div>
            <Toggle enabled={cwEnabled} onChange={setCwEnabled} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Host URL" placeholder="https://na.myconnectwise.net" />
            <InputField label="Company ID" placeholder="mycompany" />
            <InputField label="Public Key" placeholder="Public key" />
            <InputField label="Private Key" type="password" placeholder="••••••••••••" />
          </div>
        </div>

        {/* ServiceNow */}
        <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-900/30 border border-green-800/40 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">SN</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">ServiceNow</p>
                <p className="text-gray-500 text-xs">ITSM Platform Sync</p>
              </div>
            </div>
            <Toggle enabled={snEnabled} onChange={setSnEnabled} />
          </div>
          <div className="max-w-sm">
            <InputField label="Instance URL" placeholder="https://yourinstance.service-now.com" />
          </div>
        </div>

        {/* n8n Webhooks */}
        <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-900/30 border border-orange-800/40 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">n8</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">n8n Webhooks</p>
              <p className="text-gray-500 text-xs">Workflow Automation</p>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <InputField label="Webhook URL" placeholder="https://n8n.yourdomain.com/webhook/..." />
            </div>
            <button className="px-4 py-2 border border-[#1e2535] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors whitespace-nowrap">
              Test Connection
            </button>
          </div>
        </div>

        {/* Microsoft Entra SSO */}
        <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-900/30 border border-indigo-800/40 rounded-lg flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-sm">MS</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Microsoft Entra SSO</p>
                <p className="text-gray-500 text-xs">Single Sign-On via Azure AD</p>
              </div>
            </div>
            <Toggle enabled={ssoCwEnabled} onChange={setSsoEnabled} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InputField label="Tenant ID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            <InputField label="Client ID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </div>
          <p className="text-xs text-gray-500 italic">
            Redirect URI: <span className="font-mono text-gray-400">https://serviceos.gmi.com/auth/callback</span> — add this to your Entra app registration.
          </p>
        </div>
      </div>
    </div>
  );
}

function SlaTab() {
  const slaProfiles = [
    { name: 'Basic', response: '8h', resolution: '24h', appliesTo: 'Standard customers' },
    { name: 'Standard', response: '4h', resolution: '8h', appliesTo: 'All customers' },
    {
      name: 'Premium',
      response: '1h',
      resolution: '4h',
      appliesTo: 'Premium & Enterprise',
    },
  ];
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">SLA Rules</h2>
      <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e2535]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Profile Name
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Response SLA
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Resolution SLA
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Applies To
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {slaProfiles.map((p) => (
              <tr key={p.name} className="border-b border-[#1e2535] last:border-0">
                <td className="px-5 py-3.5 text-white text-sm font-medium">{p.name}</td>
                <td className="px-5 py-3.5 text-gray-300 text-sm">{p.response}</td>
                <td className="px-5 py-3.5 text-gray-300 text-sm">{p.resolution}</td>
                <td className="px-5 py-3.5 text-gray-400 text-sm">{p.appliesTo}</td>
                <td className="px-5 py-3.5">
                  <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1e2535] rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BoardsTab() {
  const boards = [
    { name: 'Service Desk', description: 'General IT support requests', enabled: true },
    { name: 'Security', description: 'Security incidents and access requests', enabled: true },
    {
      name: 'Infrastructure',
      description: 'Network, server, and hardware tickets',
      enabled: true,
    },
    {
      name: 'Access Management',
      description: 'User provisioning and permissions',
      enabled: true,
    },
    {
      name: 'Onboarding/Offboarding',
      description: 'Employee lifecycle IT tasks',
      enabled: true,
    },
    { name: 'Automation', description: 'Automated workflow tickets', enabled: false },
    { name: 'Escalations', description: 'Escalated and priority tickets', enabled: true },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">Boards</h2>
      <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl overflow-hidden">
        {boards.map((board, idx) => (
          <div
            key={board.name}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              idx < boards.length - 1 ? 'border-b border-[#1e2535]' : ''
            } hover:bg-[#161b27] transition-colors`}
          >
            <GripVertical className="w-4 h-4 text-gray-600 cursor-grab shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{board.name}</p>
              <p className="text-gray-500 text-xs">{board.description}</p>
            </div>
            <Toggle enabled={board.enabled} onChange={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  const users = [
    { name: 'Sarah Chen', email: 'sarah@gmi.com', role: 'Admin', lastLogin: '2 hours ago', status: 'Active' },
    { name: 'Mike Torres', email: 'mike@gmi.com', role: 'Technician', lastLogin: '4 hours ago', status: 'Active' },
    { name: 'Lisa Park', email: 'lisa@gmi.com', role: 'Technician', lastLogin: '1 day ago', status: 'Active' },
    { name: 'Tom Walsh', email: 'tom@gmi.com', role: 'Technician', lastLogin: '1 day ago', status: 'Active' },
    { name: 'Alex Kim', email: 'alex@gmi.com', role: 'Technician', lastLogin: '3 days ago', status: 'Active' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">Users & Roles</h2>
      <div className="bg-[#0f1117] border border-[#1e2535] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e2535]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Last Login
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-b border-[#1e2535] last:border-0">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <select
                    defaultValue={user.role}
                    className="bg-[#161b27] border border-[#1e2535] rounded-lg px-2 py-1 text-gray-300 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option>Admin</option>
                    <option>Technician</option>
                    <option>Read-only</option>
                  </select>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-sm">{user.lastLogin}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-900/40 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1e2535] rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-5">Security</h2>
      <div className="space-y-4 max-w-lg">
        {[
          { label: 'Enforce MFA for all users', enabled: true },
          { label: 'Session timeout (30 minutes)', enabled: true },
          { label: 'IP allowlist enforcement', enabled: false },
          { label: 'Audit log retention (90 days)', enabled: true },
          { label: 'Failed login lockout (5 attempts)', enabled: true },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 border-b border-[#1e2535]"
          >
            <span className="text-gray-300 text-sm">{item.label}</span>
            <Toggle enabled={item.enabled} onChange={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'sla':
        return <SlaTab />;
      case 'boards':
        return <BoardsTab />;
      case 'users':
        return <UsersTab />;
      case 'security':
        return <SecurityTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600/20 rounded-lg">
          <Settings className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Configure your GMI ServiceOS instance</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <nav className="bg-[#161b27] border border-[#1e2535] rounded-xl p-2 space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-[#1e2535]'
                }`}
              >
                <span
                  className={activeTab === item.id ? 'text-indigo-400' : 'text-gray-500'}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-[#161b27] border border-[#1e2535] rounded-xl p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
