'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Key,
  Shield,
  Package,
  Users,
  Mail,
  Lock,
  Cpu,
  Printer,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Upload,
  Brain,
  Zap,
  Sparkles,
} from 'lucide-react'

const TOP_SERVICES = [
  { slug: 'password-reset', title: 'Password Reset', category: 'Access & Identity', Icon: Key },
  { slug: 'mfa-reset', title: 'MFA Reset', category: 'Access & Identity', Icon: Shield },
  { slug: 'request-software', title: 'Request Software', category: 'Software', Icon: Package },
  { slug: 'group-access', title: 'Request Group Access', category: 'Access & Identity', Icon: Users },
  { slug: 'shared-mailbox', title: 'Shared Mailbox', category: 'Access & Identity', Icon: Mail },
  { slug: 'jit-admin', title: 'JIT Local Admin', category: 'Security', Icon: Lock },
  { slug: 'device-slow', title: 'Device Running Slow', category: 'Hardware', Icon: Cpu },
  { slug: 'printer-issue', title: 'Printer Issue', category: 'Hardware', Icon: Printer },
]

const ICON_BG: Record<string, string> = {
  'Access & Identity': 'bg-indigo-600/10 text-indigo-400',
  Software: 'bg-blue-600/10 text-blue-400',
  Hardware: 'bg-orange-600/10 text-orange-400',
  Security: 'bg-red-600/10 text-red-400',
  Onboarding: 'bg-green-600/10 text-green-400',
}

const STEPS = ['Select Service', 'Details', 'Review']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done
                    ? 'bg-indigo-600 text-white'
                    : active
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20'
                    : 'bg-[#1e2535] text-gray-500'
                }`}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  active ? 'text-white' : done ? 'text-indigo-400' : 'text-gray-600'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-20 h-0.5 mx-2 mb-5 transition-all ${i < current ? 'bg-indigo-600' : 'bg-[#1e2535]'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function NewRequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselect = searchParams.get('service') ?? ''

  const [step, setStep] = useState(0)
  const [selectedSlug, setSelectedSlug] = useState(preselect)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [summaryError, setSummaryError] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (preselect) setSelectedSlug(preselect)
  }, [preselect])

  const selectedService = TOP_SERVICES.find((s) => s.slug === selectedSlug)

  function goNext() {
    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      if (!summary.trim()) {
        setSummaryError(true)
        return
      }
      setSummaryError(false)
      setStep(2)
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1)
  }

  function handleSubmit() {
    const id = Math.floor(Math.random() * 9000 + 1000).toString()
    setTicketId(id)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-green-600/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Ticket Created Successfully</h2>
        <p className="text-gray-400 mb-4">Your request has been submitted and is being processed.</p>
        <div className="inline-flex items-center gap-2 bg-[#161b27] border border-[#1e2535] text-white font-mono text-xl font-bold px-6 py-3 rounded-xl mb-8">
          TKT-{ticketId}
        </div>
        <div className="bg-indigo-950/50 border border-indigo-700/50 rounded-xl p-4 max-w-sm mx-auto mb-8 text-sm text-indigo-300">
          <Sparkles className="w-4 h-4 inline mr-2 text-indigo-400" />
          AI has routed your ticket to the appropriate team. Estimated response: under 2 hours.
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/portal"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Back to Portal
          </Link>
          <Link
            href="/tickets"
            className="border border-[#1e2535] hover:border-gray-600 text-gray-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            View My Tickets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <StepIndicator current={step} />

      {/* Step 1: Select Service */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Select a Service</h2>
          <p className="text-gray-500 text-sm mb-6">
            Choose the service that best describes your request. Not sure?{' '}
            <Link href="/catalog" className="text-indigo-400 hover:text-indigo-300">Browse the full catalog.</Link>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOP_SERVICES.map((svc) => {
              const iconCls = ICON_BG[svc.category] ?? 'bg-gray-600/10 text-gray-400'
              const selected = selectedSlug === svc.slug
              return (
                <button
                  key={svc.slug}
                  onClick={() => setSelectedSlug(svc.slug)}
                  className={`bg-[#161b27] rounded-xl p-5 text-left flex flex-col gap-4 transition-all border-2 ${
                    selected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-950/30'
                      : 'border-[#1e2535] hover:border-indigo-600/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${iconCls} flex items-center justify-center`}>
                    <svc.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm mb-1">{svc.title}</div>
                    <div className="text-xs text-gray-500">{svc.category}</div>
                  </div>
                  {selected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {!selectedSlug && (
            <p className="text-yellow-500 text-sm mt-4">Please select a service to continue.</p>
          )}
        </div>
      )}

      {/* Step 2: Details */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Request Details</h2>
          <p className="text-gray-500 text-sm mb-6">Fill in the details for your request.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors appearance-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Summary <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => { setSummary(e.target.value); setSummaryError(false) }}
              placeholder="Brief one-line description of your issue"
              className={`w-full bg-[#161b27] border ${summaryError ? 'border-red-500' : 'border-[#1e2535] focus:border-indigo-500/60'} text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors`}
            />
            {summaryError && <p className="text-red-400 text-xs mt-1">Summary is required.</p>}
          </div>
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide as much detail as possible about your issue or request..."
              className="w-full bg-[#161b27] border border-[#1e2535] focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
            />
          </div>
          {/* File Attachment */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Attachments (optional)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false) }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragging ? 'border-indigo-500 bg-indigo-950/20' : 'border-[#1e2535] hover:border-gray-600'
              }`}
            >
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Drag and drop files here, or</p>
              <button className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                browse to upload
              </button>
              <p className="text-xs text-gray-600 mt-2">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Review Your Request</h2>
          <p className="text-gray-500 text-sm mb-6">Please confirm all details before submitting.</p>

          {/* AI Triage Panel */}
          <div className="bg-indigo-950/50 border border-indigo-700/50 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span className="text-indigo-300 font-semibold text-sm">AI Triage Analysis</span>
              <span className="ml-auto bg-indigo-600/20 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-600/40">
                Confidence: 94%
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-200">
                  AI has classified this as:{' '}
                  <strong>{selectedService?.category ?? 'General'}</strong> — {priority} priority
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-200">
                  Recommended: Auto-assign to{' '}
                  <strong>{selectedService?.category ?? 'General IT'} board</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1e2535]">
              <h3 className="font-medium text-white text-sm">Request Summary</h3>
            </div>
            <div className="divide-y divide-[#1e2535]">
              {[
                { label: 'Service', value: selectedService?.title ?? '—' },
                { label: 'Category', value: selectedService?.category ?? '—' },
                { label: 'Name', value: name || '—' },
                { label: 'Email', value: email || '—' },
                { label: 'Phone', value: phone || '—' },
                { label: 'Summary', value: summary },
                { label: 'Priority', value: priority },
              ].map((row) => (
                <div key={row.label} className="flex gap-4 px-6 py-3">
                  <span className="text-sm text-gray-500 w-24 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-white flex-1">{row.value}</span>
                </div>
              ))}
              {description && (
                <div className="flex gap-4 px-6 py-3">
                  <span className="text-sm text-gray-500 w-24 flex-shrink-0">Description</span>
                  <span className="text-sm text-white flex-1 whitespace-pre-wrap">{description}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1e2535]">
        <div>
          {step > 0 && (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 border border-[#1e2535] hover:border-gray-600 text-gray-300 hover:text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
        <div>
          {step < 2 ? (
            <button
              onClick={goNext}
              disabled={step === 0 && !selectedSlug}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Request
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default function NewRequestPage() {
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
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link href="/portal" className="hover:text-white transition-colors">Portal</Link>
          <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/portal" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Portal
          </Link>
          <h1 className="text-3xl font-bold text-white mb-1">New Service Request</h1>
          <p className="text-gray-500 text-sm">Submit a request and our AI will route it to the right team.</p>
        </div>
        <div className="bg-[#161b27] border border-[#1e2535] rounded-2xl p-8">
          <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
            <NewRequestForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
