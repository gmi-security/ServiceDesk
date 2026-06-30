'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  PlusCircle,
  Ticket,
  BookOpen,
  KeyRound,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
  ArrowRight,
  FileText,
  HelpCircle,
} from 'lucide-react'

const tickets = [
  {
    id: 'TKT-1042',
    title: 'Cannot access SharePoint',
    status: 'Open',
    priority: 'Medium',
    updated: '2 hours ago',
  },
  {
    id: 'TKT-1038',
    title: 'Outlook not syncing on mobile',
    status: 'In Progress',
    priority: 'Low',
    updated: '5 hours ago',
  },
  {
    id: 'TKT-1031',
    title: 'Need access to project X drive',
    status: 'Awaiting Approval',
    priority: 'High',
    updated: '1 day ago',
  },
]

const articles = [
  { title: 'How to reset your password using self-service', views: '2.4k views' },
  { title: 'Setting up MFA on a new device', views: '1.8k views' },
  { title: 'Connecting to VPN from home', views: '1.2k views' },
  { title: 'Requesting access to a shared drive', views: '980 views' },
  { title: 'Installing approved software from the company portal', views: '860 views' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Open: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'In Progress': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    'Awaiting Approval': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Resolved: 'bg-green-500/10 text-green-400 border-green-500/30',
  }
  const icon: Record<string, React.ReactNode> = {
    Open: <AlertCircle className="w-3 h-3" />,
    'In Progress': <Loader2 className="w-3 h-3" />,
    'Awaiting Approval': <Clock className="w-3 h-3" />,
    Resolved: <CheckCircle2 className="w-3 h-3" />,
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${map[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
      {icon[status]}
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    Low: 'text-gray-400',
    Medium: 'text-yellow-400',
    High: 'text-orange-400',
    Critical: 'text-red-400',
  }
  return (
    <span className={`text-xs font-medium ${map[priority] ?? 'text-gray-400'}`}>{priority}</span>
  )
}

export default function PortalPage() {
  const [search, setSearch] = useState('')

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
          <Link href="/catalog" className="text-gray-400 hover:text-white transition-colors">Catalog</Link>
          <Link href="/tickets" className="text-gray-400 hover:text-white transition-colors">My Tickets</Link>
          <Link href="/knowledge" className="text-gray-400 hover:text-white transition-colors">Knowledge</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">How can we help you today?</h1>
          <p className="text-gray-400">Search for answers or browse our services below</p>
        </div>

        {/* Search */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for help, services, or articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white placeholder-gray-500 rounded-xl pl-12 pr-5 py-4 text-base outline-none transition-colors"
          />
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                Icon: PlusCircle,
                label: 'New Request',
                desc: 'Submit a new service request',
                href: '/request/new',
                color: 'text-indigo-400',
                bg: 'bg-indigo-600/10',
              },
              {
                Icon: Ticket,
                label: 'Check Status',
                desc: 'View your open tickets',
                href: '/tickets',
                color: 'text-blue-400',
                bg: 'bg-blue-600/10',
              },
              {
                Icon: BookOpen,
                label: 'Knowledge Base',
                desc: 'Browse help articles',
                href: '/knowledge',
                color: 'text-purple-400',
                bg: 'bg-purple-600/10',
              },
              {
                Icon: KeyRound,
                label: 'Reset Password',
                desc: 'Self-service password reset',
                href: '/request/new?service=password-reset',
                color: 'text-green-400',
                bg: 'bg-green-600/10',
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-[#161b27] border border-[#1e2535] hover:border-indigo-600/40 hover:bg-indigo-600/5 rounded-xl p-6 flex flex-col gap-4 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
                  <action.Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1">
                    {action.label}
                  </div>
                  <div className="text-sm text-gray-500">{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Open Tickets */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">My Open Tickets</h2>
              <Link href="/tickets" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
              {tickets.map((t, i) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-4 hover:bg-[#1a2032] transition-colors group cursor-pointer ${
                    i < tickets.length - 1 ? 'border-b border-[#1e2535]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#0f1117] border border-[#1e2535] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 font-mono mb-0.5">{t.id}</div>
                      <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                        {t.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={t.status} />
                        <span className="text-gray-600 text-xs">·</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-600 hidden sm:block">{t.updated}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Popular Articles</h2>
              <Link href="/knowledge" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
              {articles.map((a, i) => (
                <Link
                  key={a.title}
                  href="/knowledge"
                  className={`flex items-start gap-3 p-4 hover:bg-[#1a2032] transition-colors group ${
                    i < articles.length - 1 ? 'border-b border-[#1e2535]' : ''
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug mb-1">
                      {a.title}
                    </div>
                    <div className="text-xs text-gray-600">{a.views}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#161b27] border border-[#1e2535] rounded-2xl p-8 text-center">
          <p className="text-gray-400 mb-4">Need more help? Contact support</p>
          <Link
            href="/request/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Open a Support Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
