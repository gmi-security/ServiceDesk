'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Key,
  Shield,
  Package,
  Users,
  Mail,
  Lock,
  Cpu,
  Printer,
  Globe,
  UserPlus,
  UserMinus,
  AlertTriangle,
  Database,
  FileText,
  Monitor,
  Network,
  ArrowRight,
  Zap,
} from 'lucide-react'

type Category = 'All' | 'Access & Identity' | 'Software' | 'Hardware' | 'Security' | 'Onboarding'

const CATEGORIES: Category[] = ['All', 'Access & Identity', 'Software', 'Hardware', 'Security', 'Onboarding']

const CATEGORY_COLORS: Record<string, string> = {
  'Access & Identity': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  Software: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Hardware: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Security: 'bg-red-500/10 text-red-400 border-red-500/30',
  Onboarding: 'bg-green-500/10 text-green-400 border-green-500/30',
}

const ICON_BG: Record<string, string> = {
  'Access & Identity': 'bg-indigo-600/10 text-indigo-400',
  Software: 'bg-blue-600/10 text-blue-400',
  Hardware: 'bg-orange-600/10 text-orange-400',
  Security: 'bg-red-600/10 text-red-400',
  Onboarding: 'bg-green-600/10 text-green-400',
}

const services = [
  { slug: 'password-reset', title: 'Password Reset', category: 'Access & Identity' as Category, Icon: Key, desc: 'Self-service password reset for Active Directory and Microsoft 365 accounts' },
  { slug: 'mfa-reset', title: 'MFA Reset', category: 'Access & Identity' as Category, Icon: Shield, desc: 'Reset your multi-factor authentication devices' },
  { slug: 'request-software', title: 'Request Software', category: 'Software' as Category, Icon: Package, desc: 'Request licensed software installation on your device' },
  { slug: 'group-access', title: 'Request Group Access', category: 'Access & Identity' as Category, Icon: Users, desc: 'Request access to security groups or distribution lists' },
  { slug: 'shared-mailbox', title: 'Request Shared Mailbox', category: 'Access & Identity' as Category, Icon: Mail, desc: 'Request a new or existing shared mailbox' },
  { slug: 'jit-admin', title: 'JIT Local Admin', category: 'Security' as Category, Icon: Lock, desc: 'Just-in-time local administrator access' },
  { slug: 'device-slow', title: 'Device Running Slow', category: 'Hardware' as Category, Icon: Cpu, desc: 'Performance diagnostics for your workstation or laptop' },
  { slug: 'printer-issue', title: 'Printer Issue', category: 'Hardware' as Category, Icon: Printer, desc: 'Troubleshoot printer connectivity and printing issues' },
  { slug: 'vpn-issue', title: 'VPN Issue', category: 'Software' as Category, Icon: Globe, desc: 'Troubleshoot VPN connection and access issues' },
  { slug: 'new-user', title: 'New User Onboarding', category: 'Onboarding' as Category, Icon: UserPlus, desc: 'Set up accounts and access for a new employee' },
  { slug: 'offboarding', title: 'Employee Offboarding', category: 'Onboarding' as Category, Icon: UserMinus, desc: 'Secure account closure and equipment return' },
  { slug: 'report-phishing', title: 'Report Phishing', category: 'Security' as Category, Icon: AlertTriangle, desc: 'Report a suspected phishing email for analysis' },
  { slug: 'backup-alert', title: 'Backup Alert Triage', category: 'Security' as Category, Icon: Database, desc: 'Investigate and resolve backup job failures' },
  { slug: 'monthly-report', title: 'Monthly Report Request', category: 'Software' as Category, Icon: FileText, desc: 'Request custom monthly reports and data exports' },
  { slug: 'request-hardware', title: 'Request Hardware', category: 'Hardware' as Category, Icon: Monitor, desc: 'Request new or replacement hardware equipment' },
  { slug: 'network-access', title: 'Network Access Request', category: 'Access & Identity' as Category, Icon: Network, desc: 'Request access to network resources and VLANs' },
]

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = services.filter((s) => {
    const matchTab = activeTab === 'All' || s.category === activeTab
    const matchSearch =
      search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1e2535] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">GMI ServiceOS</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/portal" className="text-gray-400 hover:text-white transition-colors">Portal</Link>
          <Link href="/tickets" className="text-gray-400 hover:text-white transition-colors">My Tickets</Link>
          <Link href="/knowledge" className="text-gray-400 hover:text-white transition-colors">Knowledge</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Service Catalog</h1>
          <p className="text-gray-400">Browse and request IT services — most are fulfilled automatically.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#161b27] border border-[#1e2535] text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="text-sm text-gray-500 mb-6">
          {filtered.length} service{filtered.length !== 1 ? 's' : ''} available
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No services match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((svc) => {
              const iconClasses = ICON_BG[svc.category] ?? 'bg-gray-600/10 text-gray-400'
              const catBadge = CATEGORY_COLORS[svc.category] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30'
              return (
                <div
                  key={svc.slug}
                  className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5 flex flex-col hover:border-indigo-600/30 transition-colors group"
                >
                  <div className={`w-11 h-11 rounded-xl ${iconClasses} flex items-center justify-center mb-4 flex-shrink-0`}>
                    <svc.Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1e2535]">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${catBadge}`}>
                      {svc.category}
                    </span>
                    <Link
                      href={`/request/new?service=${svc.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Request
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
