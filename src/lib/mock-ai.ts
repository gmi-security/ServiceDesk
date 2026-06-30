// ============================================
// Mock AI Triage Service
// Used when OPENAI_API_KEY is not configured.
// Simulates intelligent triage via keyword
// matching with realistic confidence scores.
// ============================================

export type TriageBoard =
  | 'Security'
  | 'Access Management'
  | 'Hardware'
  | 'Software'
  | 'Network'
  | 'Cloud & Infrastructure'
  | 'Service Requests'
  | 'General IT'

export type TriagePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export interface TriageResult {
  board: TriageBoard
  priority: TriagePriority
  category: string
  confidence: number // 0.0 – 1.0
  recommendedAction: string
  tags: string[]
  summary: string
}

// ============================================
// Keyword rule sets
// ============================================

const SECURITY_KEYWORDS = [
  'hack', 'breach', 'phishing', 'malware', 'ransomware', 'virus', 'attack',
  'compromised', 'unauthorized access', 'suspicious', 'data leak', 'data loss',
  'credential', 'password stolen', 'identity theft', 'intrusion', 'vulnerability',
  'exploit', 'zero-day', 'threat', 'incident', 'mfa bypass', 'social engineering',
  'spam email', 'infected', 'trojan', 'worm', 'rootkit', 'keylogger',
]

const ACCESS_KEYWORDS = [
  'access', 'permission', 'denied', 'locked out', 'password reset', 'account',
  'login', 'sign in', 'cannot log in', 'forgot password', 'two factor', 'mfa',
  'vpn', 'remote access', 'active directory', 'azure ad', 'sso', 'okta',
  'role', 'group', 'provisioning', 'deprovisioning', 'onboarding', 'offboarding',
  'new user', 'user account', 'disable account', 'unlock',
]

const HARDWARE_KEYWORDS = [
  'computer', 'laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'printer',
  'hardware', 'screen', 'display', 'broken', 'damaged', 'physical', 'device',
  'battery', 'charger', 'power', 'won\'t turn on', 'blue screen', 'bsod',
  'overheating', 'fan', 'hard drive', 'ssd', 'ram', 'memory', 'headset',
  'webcam', 'docking station', 'usb', 'port', 'cable', 'replace', 'repair',
]

const NETWORK_KEYWORDS = [
  'network', 'internet', 'wifi', 'wi-fi', 'wireless', 'ethernet', 'vpn',
  'connectivity', 'connection', 'slow internet', 'no internet', 'bandwidth',
  'firewall', 'dns', 'ip address', 'dhcp', 'router', 'switch', 'cable',
  'ping', 'latency', 'packet loss', 'outage', 'disconnected', 'proxy',
  'network drive', 'shared drive', 'file share', 'smb',
]

const CLOUD_KEYWORDS = [
  'azure', 'aws', 'gcp', 'cloud', 'server', 'virtual machine', 'vm', 'container',
  'docker', 'kubernetes', 'deployment', 'devops', 'ci/cd', 'pipeline', 'infrastructure',
  'terraform', 'ansible', 'certificate', 'ssl', 'tls', 'domain', 'dns record',
  'storage', 'blob', 's3', 'database', 'sql', 'cosmos', 'backup', 'restore',
  'scaling', 'load balancer', 'api gateway', 'microservice',
]

const SOFTWARE_KEYWORDS = [
  'software', 'application', 'app', 'install', 'uninstall', 'update', 'upgrade',
  'error', 'crash', 'freeze', 'slow', 'not working', 'bug', 'office', 'excel',
  'word', 'outlook', 'teams', 'sharepoint', 'onedrive', 'adobe', 'license',
  'activation', 'plugin', 'extension', 'browser', 'chrome', 'edge', 'firefox',
  'windows', 'macos', 'antivirus', 'endpoint', 'intune', 'autopilot',
]

const CRITICAL_KEYWORDS = [
  'down', 'outage', 'production', 'critical', 'urgent', 'emergency', 'all users',
  'everyone', 'company-wide', 'ransomware', 'breach', 'hack', 'data loss',
  'cannot work', 'blocked', 'revenue', 'customer impact', 'sla breach',
]

const HIGH_KEYWORDS = [
  'manager', 'executive', 'vip', 'director', 'ceo', 'cfo', 'cto', 'multiple users',
  'team', 'department', 'meeting', 'deadline', 'important', 'asap', 'immediately',
  'high priority', 'business impact',
]

// ============================================
// Scoring helper
// ============================================

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  let score = 0
  for (const kw of keywords) {
    if (lower.includes(kw)) score++
  }
  return score
}

function pickBoard(title: string, description: string): { board: TriageBoard; category: string; tags: string[] } {
  const combined = `${title} ${description}`

  const scores: Record<TriageBoard, number> = {
    'Security': scoreText(combined, SECURITY_KEYWORDS),
    'Access Management': scoreText(combined, ACCESS_KEYWORDS),
    'Hardware': scoreText(combined, HARDWARE_KEYWORDS),
    'Network': scoreText(combined, NETWORK_KEYWORDS),
    'Cloud & Infrastructure': scoreText(combined, CLOUD_KEYWORDS),
    'Software': scoreText(combined, SOFTWARE_KEYWORDS),
    'Service Requests': 0,
    'General IT': 0,
  }

  const topBoard = (Object.entries(scores) as [TriageBoard, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0]

  if (topBoard[1] === 0) {
    return { board: 'General IT', category: 'General Request', tags: ['general'] }
  }

  const board = topBoard[0]
  const categoryMap: Record<TriageBoard, string> = {
    'Security': 'Security Incident',
    'Access Management': 'Access & Identity',
    'Hardware': 'Hardware Support',
    'Network': 'Network Connectivity',
    'Cloud & Infrastructure': 'Infrastructure',
    'Software': 'Software Support',
    'Service Requests': 'Service Request',
    'General IT': 'General IT Support',
  }

  // Collect matching tags
  const allKeywords = [...SECURITY_KEYWORDS, ...ACCESS_KEYWORDS, ...HARDWARE_KEYWORDS,
    ...NETWORK_KEYWORDS, ...CLOUD_KEYWORDS, ...SOFTWARE_KEYWORDS]
  const tags = allKeywords
    .filter(kw => combined.toLowerCase().includes(kw))
    .slice(0, 5)

  return { board, category: categoryMap[board], tags }
}

function determinePriority(title: string, description: string): TriagePriority {
  const combined = `${title} ${description}`
  const criticalScore = scoreText(combined, CRITICAL_KEYWORDS)
  const highScore = scoreText(combined, HIGH_KEYWORDS)

  if (criticalScore >= 2) return 'CRITICAL'
  if (criticalScore === 1 || highScore >= 2) return 'HIGH'
  if (highScore === 1) return 'MEDIUM'
  return 'LOW'
}

function calcConfidence(title: string, description: string): number {
  const combined = `${title} ${description}`
  const totalWords = combined.split(/\s+/).length

  // More words = more signal = higher confidence
  const base = 0.6
  const wordBonus = Math.min((totalWords / 50) * 0.2, 0.2)
  const noise = (Math.random() - 0.5) * 0.1

  return Math.min(0.95, Math.max(0.60, base + wordBonus + noise))
}

function getRecommendedAction(board: TriageBoard, priority: TriagePriority): string {
  if (priority === 'CRITICAL') {
    return 'Escalate immediately. Page on-call engineer and notify management. Do not delay triage.'
  }

  const actions: Record<TriageBoard, string> = {
    'Security': 'Isolate affected systems. Engage security team. Begin incident response protocol.',
    'Access Management': 'Verify user identity. Check AD/Entra ID account status. Reset credentials if confirmed.',
    'Hardware': 'Schedule hardware assessment. Order replacement if under warranty. Provide loaner if needed.',
    'Network': 'Run diagnostic ping/traceroute. Check switch/AP status. Engage network team if widespread.',
    'Cloud & Infrastructure': 'Check Azure/AWS health dashboards. Review recent deployments. Engage DevOps team.',
    'Software': 'Collect error logs and screenshots. Try standard reinstall. Check for known issues/patches.',
    'Service Requests': 'Acknowledge request. Verify approval if required. Schedule fulfillment.',
    'General IT': 'Gather additional information. Assign to appropriate queue.',
  }

  return actions[board] ?? 'Review ticket details and assign to appropriate technician.'
}

function generateSummary(title: string, description: string, board: TriageBoard, priority: TriagePriority): string {
  const truncatedDesc = description.length > 100
    ? description.slice(0, 100).trimEnd() + '...'
    : description

  return `[${priority}] ${title} — Routed to ${board}. ${truncatedDesc}`
}

// ============================================
// Public API
// ============================================

export async function triageTicket(
  title: string,
  description: string,
): Promise<TriageResult> {
  // Simulate async processing delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))

  const { board, category, tags } = pickBoard(title, description)
  const priority = determinePriority(title, description)
  const confidence = calcConfidence(title, description)
  const recommendedAction = getRecommendedAction(board, priority)
  const summary = generateSummary(title, description, board, priority)

  return {
    board,
    priority,
    category,
    confidence: Math.round(confidence * 100) / 100,
    recommendedAction,
    tags,
    summary,
  }
}

export async function detectDuplicates(
  title: string,
  existingTitles: Array<{ id: string; title: string }>,
): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const titleNorm = normalize(title)
  const titleWords = new Set(titleNorm.split(/\s+/).filter(w => w.length > 3))

  const matches: string[] = []

  for (const existing of existingTitles) {
    const existNorm = normalize(existing.title)
    const existWords = existNorm.split(/\s+/).filter(w => w.length > 3)

    // Count word overlap
    const overlap = existWords.filter(w => titleWords.has(w)).length
    const similarity = existWords.length > 0 ? overlap / existWords.length : 0

    if (similarity >= 0.5) {
      matches.push(existing.id)
    }
  }

  return matches
}

export async function summarizeHistory(
  comments: Array<{ author: string; body: string; createdAt: string | Date }>,
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 150))

  if (comments.length === 0) {
    return 'No comments or history available for this ticket.'
  }

  const recent = comments.slice(-5)
  const firstComment = comments[0]
  const lastComment = comments[comments.length - 1]

  let summary = `This ticket has ${comments.length} comment${comments.length > 1 ? 's' : ''}.`

  if (comments.length > 1) {
    summary += ` Conversation started by ${firstComment.author} and most recently updated by ${lastComment.author}.`
  }

  summary += ` Recent updates:\n`

  for (const comment of recent) {
    const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    const preview = comment.body.slice(0, 80).trimEnd()
    summary += `• [${date}] ${comment.author}: "${preview}${comment.body.length > 80 ? '...' : ''}"\n`
  }

  return summary.trim()
}

export async function draftCustomerUpdate(ticket: {
  number: string
  title: string
  status: string
  priority: string
  assignedTo?: string | null
  lastUpdated?: Date | string | null
}): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 150))

  const statusMessages: Record<string, string> = {
    NEW: 'has been received and is in our queue',
    OPEN: 'is open and awaiting assignment',
    IN_PROGRESS: 'is currently being worked on by our team',
    WAITING_ON_CUSTOMER: 'is on hold pending your response',
    WAITING_ON_THIRD_PARTY: 'is on hold while we await a response from a third-party vendor',
    RESOLVED: 'has been resolved. Please let us know if you need any further assistance',
    CLOSED: 'has been closed',
    CANCELLED: 'has been cancelled',
  }

  const statusMsg = statusMessages[ticket.status] ?? 'is being reviewed'
  const assigneeLine = ticket.assignedTo
    ? `Your ticket has been assigned to ${ticket.assignedTo}.`
    : ''

  return `Hello,

Thank you for contacting GMI IT Support. We wanted to provide you with an update on your ticket.

**Ticket:** ${ticket.number}
**Subject:** ${ticket.title}
**Priority:** ${ticket.priority}
**Status:** ${ticket.status.replace(/_/g, ' ')}

Your request ${statusMsg}. ${assigneeLine}

We are committed to resolving your issue as quickly as possible. If you have additional information to share or need to update us on your situation, please reply directly to this message.

You can also check the status of your ticket at any time through the GMI Self-Service Portal.

Thank you for your patience.

Best regards,
GMI IT Support Team`
}
