'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Bot,
  Zap,
  User,
  Send,
  Building2,
  Mail,
  Monitor,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ClipboardCheck,
  PlayCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function TicketDetailPage() {
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isAssigned, setIsAssigned] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN - col-span-2 */}
          <div className="lg:col-span-2 space-y-5">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <button
                onClick={() => router.push('/tickets')}
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                Tickets
              </button>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white/70 font-mono">TKT-1053</span>
            </div>

            {/* Ticket Header */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs font-mono text-gray-400 mb-1">TKT-1053</p>
                  <h1 className="text-xl font-bold text-white/90">
                    Ransomware alert on workstation WS-042
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Open
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                  Critical
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                  Security
                </span>
              </div>
            </div>

            {/* AI Triage Panel */}
            <div className="bg-indigo-950/50 border border-indigo-700/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-indigo-300">AI Triage</span>
                <span className="ml-auto text-xs text-indigo-400 bg-indigo-900/50 px-2 py-0.5 rounded-full border border-indigo-700/50">
                  Confidence: 94%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-800/40">
                  <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">Threat Classification</p>
                  <p className="text-sm font-semibold text-red-400">Ransomware — Critical</p>
                </div>
                <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-800/40">
                  <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">Immediate Action</p>
                  <p className="text-sm font-semibold text-white/90">Isolate affected workstation</p>
                </div>
              </div>
              <div className="mt-3 bg-indigo-900/20 rounded-lg p-3 border border-indigo-800/30">
                <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1.5">Auto-assigned Fields</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-indigo-800/40 text-indigo-300 px-2 py-0.5 rounded">Board → Security</span>
                  <span className="bg-indigo-800/40 text-indigo-300 px-2 py-0.5 rounded">Priority → Critical</span>
                  <span className="bg-indigo-800/40 text-indigo-300 px-2 py-0.5 rounded">Urgency → Immediate</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Security alert triggered by EDR solution on workstation WS-042 at Pinnacle Group.
                Detected suspicious encryption activity consistent with ransomware behavior. User reports
                files becoming inaccessible. Multiple directories affected including Documents and Desktop.
                Network shares may also be at risk. Immediate isolation recommended to prevent lateral movement.
              </p>
            </div>

            {/* Activity Feed */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Activity</h2>
              <div className="space-y-5">

                {/* Event 1 - System */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e2535] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">System</span>
                      <span className="text-xs text-gray-600">23 min ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Ticket created via email alert</p>
                  </div>
                </div>

                {/* Event 2 - AI Triage */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-indigo-300">AI Triage</span>
                      <span className="text-xs text-gray-600">22 min ago</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Auto-classified as Ransomware threat, priority set to Critical
                    </p>
                  </div>
                </div>

                {/* Event 3 - Sarah Chen comment */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">SC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white/90">Sarah Chen</span>
                      <span className="text-xs text-gray-600">20 min ago</span>
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full">
                        Public
                      </span>
                    </div>
                    <div className="bg-[#1e2535] rounded-lg p-3 text-sm text-white/80">
                      I&apos;ve been notified. Initiating isolation procedure now.
                    </div>
                  </div>
                </div>

                {/* Event 4 - Automation */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e2535] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">System</span>
                      <span className="text-xs text-gray-600">19 min ago</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Automation triggered:{' '}
                      <span className="text-purple-400 font-mono text-xs bg-purple-900/20 px-1.5 py-0.5 rounded">
                        Isolate-Workstation-n8n
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Comment */}
              <div className="mt-6 pt-5 border-t border-[#1e2535]">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full bg-[#1e2535] border border-[#2a3347] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex rounded-lg overflow-hidden border border-[#1e2535]">
                        <button
                          onClick={() => setIsPublic(true)}
                          className={`px-3 py-1.5 text-xs font-medium transition-colors ${isPublic ? 'bg-green-600 text-white' : 'bg-[#1e2535] text-gray-400 hover:text-gray-300'}`}
                        >
                          Public
                        </button>
                        <button
                          onClick={() => setIsPublic(false)}
                          className={`px-3 py-1.5 text-xs font-medium transition-colors ${!isPublic ? 'bg-yellow-600 text-white' : 'bg-[#1e2535] text-gray-400 hover:text-gray-300'}`}
                        >
                          Internal
                        </button>
                      </div>
                      <button className="ml-auto flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
                        <Send className="w-3.5 h-3.5" />
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            {/* Metadata Card */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Board', value: 'Security' },
                  { label: 'Impact', value: 'Organization' },
                  { label: 'Urgency', value: 'Immediate' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-xs text-white/80 font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-500/30 transition-colors">
                    <span className="text-xs font-medium">Open</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Priority</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    Critical
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment Card */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assignment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Team</span>
                  <span className="text-xs text-white/80 font-medium">Security Response</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Technician</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {isAssigned ? 'Sarah Chen' : 'Unassigned'}
                    </span>
                    <button
                      onClick={() => setIsAssigned(!isAssigned)}
                      className="text-xs text-indigo-400 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 px-2 py-0.5 rounded transition-colors"
                    >
                      {isAssigned ? 'Unassign' : 'Assign to me'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company / Contact Card */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Company & Contact</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-white/80 font-medium">Pinnacle Group</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Robert Chen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <a href="mailto:robert@pinnaclegroup.com" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    robert@pinnaclegroup.com
                  </a>
                </div>
              </div>
            </div>

            {/* SLA Card */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SLA</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Response SLA</span>
                    <span className="text-xs font-semibold text-red-400">BREACHED</span>
                  </div>
                  <p className="text-xs text-red-400/80">23m over deadline</p>
                  <div className="mt-1.5 h-1.5 bg-[#1e2535] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Resolution SLA</span>
                    <span className="text-xs font-semibold text-yellow-400">3h 37m remaining</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-[#1e2535] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Assets */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Linked Assets</h3>
              <div className="flex items-center gap-2 bg-[#1e2535] rounded-lg px-3 py-2">
                <Monitor className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white/90">WS-042</p>
                  <p className="text-xs text-gray-500">Windows 11</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 hover:border-green-500/50 rounded-lg px-3 py-2 text-sm font-medium transition-all">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Resolve Ticket
                </button>
                <button className="w-full flex items-center gap-2.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg px-3 py-2 text-sm font-medium transition-all">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  Escalate
                </button>
                <button className="w-full flex items-center gap-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 rounded-lg px-3 py-2 text-sm font-medium transition-all">
                  <ClipboardCheck className="w-4 h-4 flex-shrink-0" />
                  Request Approval
                </button>
                <button className="w-full flex items-center gap-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 rounded-lg px-3 py-2 text-sm font-medium transition-all">
                  <PlayCircle className="w-4 h-4 flex-shrink-0" />
                  Run Automation
                </button>
                <button className="w-full flex items-center gap-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 rounded-lg px-3 py-2 text-sm font-medium transition-all">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  AI Summarize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
