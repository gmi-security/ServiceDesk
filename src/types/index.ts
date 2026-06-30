// ============================================
// GMI ServiceOS — TypeScript Type Definitions
// Plain interfaces mirroring the Prisma schema
// for use in React components and API layers.
// ============================================

// ============================================
// Enums
// ============================================

export enum TicketStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_ON_CUSTOMER = 'WAITING_ON_CUSTOMER',
  WAITING_ON_THIRD_PARTY = 'WAITING_ON_THIRD_PARTY',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  PLANNING = 'PLANNING',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  READONLY = 'READONLY',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AssetType {
  LAPTOP = 'LAPTOP',
  DESKTOP = 'DESKTOP',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  MOBILE = 'MOBILE',
  PERIPHERAL = 'PERIPHERAL',
  SOFTWARE = 'SOFTWARE',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RETIRED = 'RETIRED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum AutomationTrigger {
  TICKET_CREATED = 'TICKET_CREATED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  TICKET_RESOLVED = 'TICKET_RESOLVED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  SLA_BREACH = 'SLA_BREACH',
  SCHEDULED = 'SCHEDULED',
}

// ============================================
// Core Entities
// ============================================

export interface User {
  id: string
  email: string
  name: string
  image: string | null
  role: UserRole | string
  isActive: boolean
  department: string | null
  phone: string | null
  timezone: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Company {
  id: string
  name: string
  domain: string | null
  logo: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null
  slaLevel: string | null
  notes: string | null
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Contact {
  id: string
  companyId: string
  email: string
  name: string
  phone: string | null
  title: string | null
  department: string | null
  isActive: boolean
  isPrimary: boolean
  createdAt: Date | string
  updatedAt: Date | string
  company?: Company
}

export interface Board {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  isDefault: boolean
  sortOrder: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface SLA {
  id: string
  name: string
  description: string | null
  responseTimeMinutes: number
  resolutionTimeMinutes: number
  priority: Priority | string
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Ticket {
  id: string
  number: string
  title: string
  description: string
  status: TicketStatus | string
  priority: Priority | string
  category: string | null
  subcategory: string | null
  tags: string[]
  companyId: string | null
  contactId: string | null
  assignedUserId: string | null
  createdById: string
  boardId: string | null
  slaId: string | null
  dueAt: Date | string | null
  resolvedAt: Date | string | null
  closedAt: Date | string | null
  firstResponseAt: Date | string | null
  slaBreached: boolean
  source: string | null
  externalId: string | null
  aiTriaged: boolean
  aiConfidence: number | null
  aiBoard: string | null
  aiPriority: string | null
  aiSummary: string | null
  aiTags: string[]
  timeSpentMinutes: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Comment {
  id: string
  ticketId: string
  authorId: string
  body: string
  isInternal: boolean
  isAIGenerated: boolean
  editedAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  author?: User
}

export interface Attachment {
  id: string
  ticketId: string | null
  commentId: string | null
  uploadedById: string
  filename: string
  mimeType: string
  size: number
  url: string
  createdAt: Date | string
  uploadedBy?: User
}

export interface Approval {
  id: string
  ticketId: string
  requestedById: string
  approverId: string
  status: ApprovalStatus | string
  reason: string | null
  decidedAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  requestedBy?: User
  approver?: User
}

export interface Asset {
  id: string
  companyId: string | null
  contactId: string | null
  name: string
  type: AssetType | string
  status: AssetStatus | string
  manufacturer: string | null
  model: string | null
  serialNumber: string | null
  assetTag: string | null
  purchaseDate: Date | string | null
  warrantyExpiry: Date | string | null
  location: string | null
  notes: string | null
  specs: Record<string, unknown> | null
  createdAt: Date | string
  updatedAt: Date | string
  company?: Company
  contact?: Contact
}

export interface KnowledgeArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  status: ArticleStatus | string
  authorId: string
  categoryId: string | null
  tags: string[]
  views: number
  helpful: number
  notHelpful: number
  publishedAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  author?: User
}

export interface AutomationRule {
  id: string
  name: string
  description: string | null
  trigger: AutomationTrigger | string
  conditions: Record<string, unknown>
  actions: Record<string, unknown>[]
  isActive: boolean
  runCount: number
  lastRunAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface AutomationRun {
  id: string
  ruleId: string
  ticketId: string | null
  status: 'SUCCESS' | 'FAILURE' | 'SKIPPED'
  output: Record<string, unknown> | null
  error: string | null
  createdAt: Date | string
  rule?: AutomationRule
}

export interface AIDecisionLog {
  id: string
  ticketId: string
  action: string
  input: Record<string, unknown>
  output: Record<string, unknown>
  confidence: number | null
  model: string | null
  tokensUsed: number | null
  createdAt: Date | string
}

export interface AuditLog {
  id: string
  ticketId: string | null
  userId: string | null
  action: string
  entity: string
  entityId: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  ip: string | null
  userAgent: string | null
  createdAt: Date | string
  user?: User
}

export interface ServiceCatalogItem {
  id: string
  name: string
  description: string
  category: string
  icon: string | null
  estimatedTime: string | null
  requiresApproval: boolean
  formSchema: Record<string, unknown> | null
  defaultBoardId: string | null
  defaultPriority: Priority | string
  defaultAssigneeId: string | null
  slaId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date | string
  updatedAt: Date | string
  defaultBoard?: Board
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  type: 'TICKET_UPDATE' | 'MENTION' | 'ASSIGNMENT' | 'SLA_BREACH' | 'APPROVAL' | 'SYSTEM'
  link: string | null
  isRead: boolean
  createdAt: Date | string
}

// ============================================
// Composite / Relational Types
// ============================================

export interface TicketWithRelations extends Ticket {
  company: Company | null
  contact: Contact | null
  assignedUser: User | null
  createdBy: User
  board: Board | null
  sla: SLA | null
  comments: CommentWithAuthor[]
  attachments: Attachment[]
  approvals: Approval[]
  auditLogs: AuditLog[]
  aiDecisionLogs: AIDecisionLog[]
}

export interface CommentWithAuthor extends Comment {
  author: User
  attachments?: Attachment[]
}

export interface ContactWithCompany extends Contact {
  company: Company
}

export interface TicketListItem {
  id: string
  number: string
  title: string
  status: TicketStatus | string
  priority: Priority | string
  category: string | null
  companyId: string | null
  assignedUserId: string | null
  boardId: string | null
  slaBreached: boolean
  dueAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  company: Pick<Company, 'id' | 'name'> | null
  assignedUser: Pick<User, 'id' | 'name' | 'image'> | null
  board: Pick<Board, 'id' | 'name' | 'color'> | null
  _count?: { comments: number; attachments: number }
}

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface APIError {
  message: string
  code?: string
  field?: string
}

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: APIError
}

// ============================================
// Dashboard / Analytics Types
// ============================================

export interface DashboardStats {
  totalOpen: number
  newToday: number
  resolvedToday: number
  slaBreached: number
  avgResolutionHours: number
  ticketsByStatus: Record<string, number>
  ticketsByPriority: Record<string, number>
  ticketsByBoard: Record<string, number>
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'ticket_created' | 'ticket_updated' | 'ticket_resolved' | 'comment_added'
  ticketNumber: string
  ticketTitle: string
  ticketId: string
  actor: string
  timestamp: Date | string
}

// ============================================
// Form Types
// ============================================

export interface CreateTicketInput {
  title: string
  description: string
  priority: Priority | string
  companyId?: string
  contactId?: string
  boardId?: string
  assignedUserId?: string
  category?: string
  tags?: string[]
  dueAt?: Date | string | null
}

export interface UpdateTicketInput {
  title?: string
  description?: string
  status?: TicketStatus | string
  priority?: Priority | string
  companyId?: string | null
  contactId?: string | null
  boardId?: string | null
  assignedUserId?: string | null
  category?: string | null
  tags?: string[]
  dueAt?: Date | string | null
}

export interface CreateCommentInput {
  body: string
  isInternal?: boolean
}
