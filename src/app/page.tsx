import Link from 'next/link'
import {
  Brain,
  Activity,
  LayoutGrid,
  Key,
  Shield,
  Package,
  Users,
  Globe,
  Monitor,
  UserPlus,
  ArrowRight,
  Zap,
  HeadphonesIcon,
  CheckCircle,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1e2535] bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>GMI ServiceOS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-gray-400 hover:text-white transition-colors">
              Service Catalog
            </Link>
            <Link href="/portal" className="text-sm text-gray-400 hover:text-white transition-colors">
              Portal
            </Link>
            <Link
              href="/auth/signin"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative overflow-hidden py-32 px-6"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.15), transparent)
          `,
          backgroundSize: '60px 60px, 60px 60px, 100% 100%',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <Brain className="w-3.5 h-3.5" />
            AI-Native IT Service Management
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            GMI{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">
              ServiceOS
            </span>
          </h1>
          <p className="text-2xl text-gray-300 font-medium mb-4">
            Your AI-Native IT Service Desk
          </p>
          <p className="text-base text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Intelligent ticket triage, automated workflows, and a self-service portal that actually works —
            powered by AI from day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-600/20 text-base"
            >
              Open a Support Request
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 border border-[#1e2535] hover:border-indigo-600/50 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <div className="bg-[#161b27] border-y border-[#1e2535] py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-300 font-medium">All Systems Operational</span>
          <span className="text-gray-600">·</span>
          <span className="text-sm text-gray-500">Last checked 2 minutes ago</span>
        </div>
      </div>

      {/* Feature Highlights */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Modern IT Teams</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything your IT department needs to deliver exceptional service, powered by AI that learns and adapts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: Brain,
                title: 'AI Triage',
                desc: 'Automatically classify, prioritize, and route incoming tickets with 94%+ confidence using large language models.',
                color: 'text-indigo-400',
                bg: 'bg-indigo-600/10',
                border: 'border-indigo-600/20',
              },
              {
                Icon: LayoutGrid,
                title: 'Service Catalog',
                desc: 'A curated, searchable catalog of IT services with one-click request forms and automated fulfillment.',
                color: 'text-purple-400',
                bg: 'bg-purple-600/10',
                border: 'border-purple-600/20',
              },
              {
                Icon: Activity,
                title: 'Real-time Status',
                desc: 'Live system health dashboard and proactive incident notifications keep users informed at all times.',
                color: 'text-green-400',
                bg: 'bg-green-600/10',
                border: 'border-green-600/20',
              },
              {
                Icon: HeadphonesIcon,
                title: 'Self-Service',
                desc: 'Empower users to resolve common issues independently with guided workflows and a smart knowledge base.',
                color: 'text-blue-400',
                bg: 'bg-blue-600/10',
                border: 'border-blue-600/20',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#161b27] border border-[#1e2535] rounded-2xl p-6 hover:border-indigo-600/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <f.Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-6 bg-[#161b27]/40 border-y border-[#1e2535]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Request Any Service</h2>
            <p className="text-gray-400">Browse our full catalog or jump straight to a common request</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { Icon: Key, label: 'Password & MFA', href: '/catalog' },
              { Icon: Package, label: 'Software', href: '/catalog' },
              { Icon: Monitor, label: 'Hardware', href: '/catalog' },
              { Icon: Shield, label: 'Security', href: '/catalog' },
              { Icon: UserPlus, label: 'Onboarding', href: '/catalog' },
              { Icon: Globe, label: 'Network', href: '/catalog' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5 flex flex-col items-center gap-3 hover:border-indigo-600/40 hover:bg-indigo-600/5 transition-all group text-center"
              >
                <cat.Icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              View full service catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '94%', label: 'AI triage accuracy' },
              { value: '< 2 min', label: 'Average first response' },
              { value: '78%', label: 'Self-service resolution rate' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#161b27] border border-[#1e2535] rounded-2xl p-8">
                <div className="text-4xl font-black text-indigo-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-[#1e2535]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[#161b27] border border-[#1e2535] rounded-2xl p-12">
            <CheckCircle className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8">
              Sign in to access your portal or open a support request right now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Open a Support Request
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 border border-[#1e2535] hover:border-gray-600 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2535] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">GMI ServiceOS</div>
              <div className="text-gray-500 text-xs">AI-Native IT Service Management</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/portal" className="hover:text-gray-300 transition-colors">Portal</Link>
            <Link href="/catalog" className="hover:text-gray-300 transition-colors">Catalog</Link>
            <Link href="/knowledge" className="hover:text-gray-300 transition-colors">Knowledge Base</Link>
          </div>
          <div className="text-gray-600 text-xs">© 2026 GMI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
