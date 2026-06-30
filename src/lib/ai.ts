// ============================================
// AI Service
// Wraps OpenAI when OPENAI_API_KEY is set;
// falls back to the mock service otherwise.
// Keeps the same interface as mock-ai.ts.
// ============================================

import * as MockAI from './mock-ai'
import type { TriageResult } from './mock-ai'

export type { TriageResult, TriageBoard, TriagePriority } from './mock-ai'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY)
}

// ============================================
// OpenAI helpers
// ============================================

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function callOpenAI(messages: OpenAIMessage[], schema?: object): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const body: Record<string, unknown> = {
    model: MODEL,
    messages,
    temperature: 0.2,
    max_tokens: 1024,
  }

  if (schema) {
    body.response_format = {
      type: 'json_schema',
      json_schema: {
        name: 'structured_output',
        schema,
        strict: true,
      },
    }
  }

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ============================================
// Triage schema for structured output
// ============================================

const TRIAGE_SCHEMA = {
  type: 'object',
  properties: {
    board: {
      type: 'string',
      enum: [
        'Security',
        'Access Management',
        'Hardware',
        'Software',
        'Network',
        'Cloud & Infrastructure',
        'Service Requests',
        'General IT',
      ],
    },
    priority: {
      type: 'string',
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    },
    category: { type: 'string' },
    confidence: { type: 'number' },
    recommendedAction: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    summary: { type: 'string' },
  },
  required: ['board', 'priority', 'category', 'confidence', 'recommendedAction', 'tags', 'summary'],
  additionalProperties: false,
}

const TRIAGE_SYSTEM_PROMPT = `You are an expert IT service desk triage AI for GMI ServiceOS.
Analyze the ticket title and description and return structured JSON for routing and prioritization.

Boards available:
- Security: Cybersecurity incidents, breaches, phishing, malware, unauthorized access
- Access Management: Login issues, password resets, account provisioning, MFA, VPN access
- Hardware: Physical device issues, laptops, monitors, printers, peripherals
- Software: Application issues, installs, updates, crashes, licensing
- Network: Connectivity, Wi-Fi, VPN, network drives, DNS
- Cloud & Infrastructure: Azure/AWS/GCP, servers, VMs, deployments, certificates
- Service Requests: New equipment requests, software requests, standard fulfillment
- General IT: Anything that doesn't fit above

Priority guidelines:
- CRITICAL: Production down, security breach, data loss, company-wide outage
- HIGH: VIP/executive affected, team-wide issue, significant business impact
- MEDIUM: Single user impacted, workaround available
- LOW: Non-urgent, minor inconvenience, can wait

Set confidence between 0.60 and 0.95 based on how clearly the ticket fits a category.
Tags should be lowercase keywords (max 5), e.g. ["password-reset", "active-directory"].
Summary should be a single concise sentence under 160 characters.`

async function triageWithOpenAI(title: string, description: string): Promise<TriageResult> {
  const content = await callOpenAI(
    [
      { role: 'system', content: TRIAGE_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Triage this IT support ticket:\n\nTitle: ${title}\n\nDescription: ${description}`,
      },
    ],
    TRIAGE_SCHEMA,
  )

  const parsed = JSON.parse(content) as TriageResult
  return parsed
}

// ============================================
// Duplicate detection via OpenAI
// ============================================

async function detectDuplicatesWithOpenAI(
  title: string,
  existingTitles: Array<{ id: string; title: string }>,
): Promise<string[]> {
  if (existingTitles.length === 0) return []

  const list = existingTitles
    .map((t, i) => `${i + 1}. [${t.id}] ${t.title}`)
    .join('\n')

  const content = await callOpenAI([
    {
      role: 'system',
      content:
        'You are an IT ticket deduplication assistant. Return a JSON object with a "duplicates" array containing IDs of tickets that are likely duplicates (same issue) of the new ticket. Only include IDs with high confidence (>70%). Return {"duplicates": []} if none found.',
    },
    {
      role: 'user',
      content: `New ticket: "${title}"\n\nExisting tickets:\n${list}\n\nReturn JSON only.`,
    },
  ])

  try {
    const parsed = JSON.parse(content) as { duplicates: string[] }
    return parsed.duplicates ?? []
  } catch {
    return []
  }
}

// ============================================
// Summarize history via OpenAI
// ============================================

async function summarizeHistoryWithOpenAI(
  comments: Array<{ author: string; body: string; createdAt: string | Date }>,
): Promise<string> {
  if (comments.length === 0) return 'No comments or history available for this ticket.'

  const commentText = comments
    .map(c => `[${new Date(c.createdAt).toLocaleDateString()}] ${c.author}: ${c.body}`)
    .join('\n\n')

  const content = await callOpenAI([
    {
      role: 'system',
      content:
        'You are an IT support analyst. Summarize this ticket conversation thread in 2-4 sentences. Focus on the key issue, what was tried, and current status. Be concise and factual.',
    },
    { role: 'user', content: commentText },
  ])

  return content.trim()
}

// ============================================
// Draft customer update via OpenAI
// ============================================

async function draftCustomerUpdateWithOpenAI(ticket: {
  number: string
  title: string
  status: string
  priority: string
  assignedTo?: string | null
  lastUpdated?: Date | string | null
}): Promise<string> {
  const content = await callOpenAI([
    {
      role: 'system',
      content:
        'You are a professional IT support agent for GMI. Write a brief, empathetic customer update email for the given ticket details. Keep it professional, concise (under 150 words), and helpful. Include the ticket number and current status.',
    },
    {
      role: 'user',
      content: `Ticket: ${ticket.number}\nTitle: ${ticket.title}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}\nAssigned to: ${ticket.assignedTo ?? 'unassigned'}`,
    },
  ])

  return content.trim()
}

// ============================================
// Public API — falls back to mock if no key
// ============================================

export async function triageTicket(
  title: string,
  description: string,
): Promise<TriageResult> {
  if (!hasOpenAIKey()) {
    return MockAI.triageTicket(title, description)
  }

  try {
    return await triageWithOpenAI(title, description)
  } catch (err) {
    console.warn('[ai] OpenAI triage failed, falling back to mock:', err)
    return MockAI.triageTicket(title, description)
  }
}

export async function detectDuplicates(
  title: string,
  existingTitles: Array<{ id: string; title: string }>,
): Promise<string[]> {
  if (!hasOpenAIKey()) {
    return MockAI.detectDuplicates(title, existingTitles)
  }

  try {
    return await detectDuplicatesWithOpenAI(title, existingTitles)
  } catch (err) {
    console.warn('[ai] OpenAI duplicate detection failed, falling back to mock:', err)
    return MockAI.detectDuplicates(title, existingTitles)
  }
}

export async function summarizeHistory(
  comments: Array<{ author: string; body: string; createdAt: string | Date }>,
): Promise<string> {
  if (!hasOpenAIKey()) {
    return MockAI.summarizeHistory(comments)
  }

  try {
    return await summarizeHistoryWithOpenAI(comments)
  } catch (err) {
    console.warn('[ai] OpenAI history summary failed, falling back to mock:', err)
    return MockAI.summarizeHistory(comments)
  }
}

export async function draftCustomerUpdate(ticket: {
  number: string
  title: string
  status: string
  priority: string
  assignedTo?: string | null
  lastUpdated?: Date | string | null
}): Promise<string> {
  if (!hasOpenAIKey()) {
    return MockAI.draftCustomerUpdate(ticket)
  }

  try {
    return await draftCustomerUpdateWithOpenAI(ticket)
  } catch (err) {
    console.warn('[ai] OpenAI draft update failed, falling back to mock:', err)
    return MockAI.draftCustomerUpdate(ticket)
  }
}

export const isAIEnabled = hasOpenAIKey
