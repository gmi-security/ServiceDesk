import { PrismaClient, TicketStatus, Priority, UserRole, AssetStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean up
  await prisma.notification.deleteMany()
  await prisma.aiDecisionLog.deleteMany()
  await prisma.automationRun.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.note.deleteMany()
  await prisma.ticketAsset.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.knowledgeArticle.deleteMany()
  await prisma.serviceCatalogItem.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  await prisma.board.deleteMany()
  await prisma.company.deleteMany()
  await prisma.sLA.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()

  // SLA profiles
  const slaStandard = await prisma.sLA.create({
    data: {
      name: 'Standard',
      responseMinutes: 240,   // 4 hours
      resolveMinutes: 1440,   // 24 hours
    },
  })

  const slaPriority = await prisma.sLA.create({
    data: {
      name: 'Priority',
      responseMinutes: 60,    // 1 hour
      resolveMinutes: 240,    // 4 hours
    },
  })

  console.log('✅ SLAs created')

  // Companies
  const acme = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      shortName: 'Acme',
      domain: 'acmecorp.com',
      type: 'MANAGED',
      status: 'ACTIVE',
      slaId: slaStandard.id,
    },
  })

  const techstart = await prisma.company.create({
    data: {
      name: 'TechStart LLC',
      shortName: 'TechStart',
      domain: 'techstart.io',
      type: 'MANAGED',
      status: 'ACTIVE',
      slaId: slaPriority.id,
    },
  })

  const meridian = await prisma.company.create({
    data: {
      name: 'Meridian Health',
      shortName: 'Meridian',
      domain: 'meridianhealth.org',
      type: 'MANAGED',
      status: 'ACTIVE',
      slaId: slaPriority.id,
    },
  })

  const gmiInternal = await prisma.company.create({
    data: {
      name: 'GMI Technologies',
      shortName: 'GMI',
      domain: 'gmi.com',
      type: 'INTERNAL',
      status: 'ACTIVE',
      slaId: slaStandard.id,
    },
  })

  console.log('✅ Companies created')

  // Contacts
  const contactJohn = await prisma.contact.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@acmecorp.com',
      phone: '+1 555-0101',
      title: 'IT Director',
      companyId: acme.id,
    },
  })

  const contactSarah = await prisma.contact.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@techstart.io',
      phone: '+1 555-0102',
      title: 'CTO',
      companyId: techstart.id,
    },
  })

  const contactMark = await prisma.contact.create({
    data: {
      firstName: 'Mark',
      lastName: 'Williams',
      email: 'mwilliams@meridianhealth.org',
      phone: '+1 555-0103',
      title: 'Systems Administrator',
      companyId: meridian.id,
    },
  })

  console.log('✅ Contacts created')

  // Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@gmi.com',
      role: UserRole.ADMIN,
      companyId: gmiInternal.id,
      isActive: true,
    },
  })

  const techAlex = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@gmi.com',
      role: UserRole.TECH,
      companyId: gmiInternal.id,
      isActive: true,
    },
  })

  const techJamie = await prisma.user.create({
    data: {
      name: 'Jamie Chen',
      email: 'jamie.chen@gmi.com',
      role: UserRole.TECH,
      companyId: gmiInternal.id,
      isActive: true,
    },
  })

  const managerKate = await prisma.user.create({
    data: {
      name: 'Kate Morrison',
      email: 'kate.morrison@gmi.com',
      role: UserRole.MANAGER,
      companyId: gmiInternal.id,
      isActive: true,
    },
  })

  console.log('✅ Users created')

  // Teams
  const teamServiceDesk = await prisma.team.create({
    data: {
      name: 'Service Desk',
      description: 'Tier 1 and Tier 2 support team',
    },
  })

  const teamInfra = await prisma.team.create({
    data: {
      name: 'Infrastructure',
      description: 'Network, servers, and cloud infrastructure team',
    },
  })

  const teamSecurity = await prisma.team.create({
    data: {
      name: 'Security',
      description: 'Information security and compliance team',
    },
  })

  await prisma.teamMember.createMany({
    data: [
      { teamId: teamServiceDesk.id, userId: techAlex.id },
      { teamId: teamServiceDesk.id, userId: techJamie.id },
      { teamId: teamInfra.id, userId: techAlex.id },
      { teamId: teamSecurity.id, userId: techJamie.id },
    ],
  })

  console.log('✅ Teams created')

  // Boards
  const boards = await Promise.all([
    prisma.board.create({ data: { name: 'Service Desk', slug: 'service-desk', description: 'General IT support and helpdesk requests', order: 1, isActive: true } }),
    prisma.board.create({ data: { name: 'Security', slug: 'security', description: 'Security incidents, vulnerabilities, and compliance', order: 2, isActive: true } }),
    prisma.board.create({ data: { name: 'Infrastructure', slug: 'infrastructure', description: 'Network, servers, cloud, and datacenter operations', order: 3, isActive: true } }),
    prisma.board.create({ data: { name: 'Access Management', slug: 'access-management', description: 'User provisioning, permissions, and access requests', order: 4, isActive: true } }),
    prisma.board.create({ data: { name: 'Onboarding & Offboarding', slug: 'onboarding-offboarding', description: 'Employee lifecycle management', order: 5, isActive: true } }),
    prisma.board.create({ data: { name: 'Automation', slug: 'automation', description: 'Automated workflow and runbook execution tracking', order: 6, isActive: true } }),
    prisma.board.create({ data: { name: 'Escalations', slug: 'escalations', description: 'Priority escalations and critical incidents', order: 7, isActive: true } }),
    prisma.board.create({ data: { name: 'Customer Success', slug: 'customer-success', description: 'Client success, onboarding, and relationship management', order: 8, isActive: true } }),
    prisma.board.create({ data: { name: 'Internal GMI', slug: 'internal-gmi', description: 'Internal GMI operations and projects', order: 9, isActive: true } }),
  ])

  const [boardServiceDesk, boardSecurity, boardInfra, boardAccess] = boards

  console.log('✅ Boards created')

  // Categories
  const catHardware = await prisma.category.create({
    data: {
      name: 'Hardware',
      boardId: boardServiceDesk.id,
      subcategories: ['Laptop', 'Desktop', 'Printer', 'Monitor', 'Peripheral', 'Mobile Device'],
    },
  })

  const catSoftware = await prisma.category.create({
    data: {
      name: 'Software',
      boardId: boardServiceDesk.id,
      subcategories: ['Installation', 'License', 'Bug', 'Configuration', 'Update'],
    },
  })

  const catNetwork = await prisma.category.create({
    data: {
      name: 'Network',
      boardId: boardServiceDesk.id,
      subcategories: ['Connectivity', 'VPN', 'WiFi', 'DNS', 'Firewall'],
    },
  })

  const catIncident = await prisma.category.create({
    data: {
      name: 'Security Incident',
      boardId: boardSecurity.id,
      subcategories: ['Phishing', 'Malware', 'Data Breach', 'Unauthorized Access', 'Ransomware'],
    },
  })

  const catAccess = await prisma.category.create({
    data: {
      name: 'Access Request',
      boardId: boardAccess.id,
      subcategories: ['New User', 'Permission Change', 'Password Reset', 'MFA Setup', 'Account Unlock'],
    },
  })

  console.log('✅ Categories created')

  // Assets
  const asset1 = await prisma.asset.create({
    data: {
      name: 'Dell Latitude 5540',
      type: 'Laptop',
      serialNumber: 'DL5540-ACM-001',
      companyId: acme.id,
      contactId: contactJohn.id,
      status: AssetStatus.ACTIVE,
      metadata: { make: 'Dell', model: 'Latitude 5540', cpu: 'Intel i7-1365U', ram: '16GB', storage: '512GB SSD', os: 'Windows 11 Pro' },
    },
  })

  const asset2 = await prisma.asset.create({
    data: {
      name: 'Cisco Meraki MX85',
      type: 'Firewall',
      serialNumber: 'MX85-TST-001',
      companyId: techstart.id,
      status: AssetStatus.ACTIVE,
      metadata: { make: 'Cisco', model: 'Meraki MX85', firmware: '18.1.4', location: 'Main Office' },
    },
  })

  console.log('✅ Assets created')

  // Tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Cannot connect to VPN - getting certificate error',
      description: 'User is unable to connect to the corporate VPN. Error message: "SSL certificate verification failed". This started happening after the recent Windows update. Multiple users at the Acme office are affected.',
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      boardId: boardServiceDesk.id,
      categoryId: catNetwork.id,
      subcategory: 'VPN',
      source: 'email',
      companyId: acme.id,
      contactId: contactJohn.id,
      assignedUserId: techAlex.id,
      slaId: slaStandard.id,
      dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      aiConfidenceScore: 0.87,
      aiRecommendedAction: 'Check VPN certificate expiration and root CA trust store. Likely related to KB5034441 Windows update. Recommend running: certlm.msc to inspect certificate chain.',
    },
  })

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'New employee onboarding - Software Developer',
      description: 'New hire starting Monday: Emily Davis, Software Developer. Requires: MacBook Pro M3, GitHub Enterprise access, Jira/Confluence, Slack, Azure DevOps, development environment setup, and security training enrollment.',
      status: TicketStatus.AUTOMATION_RUNNING,
      priority: Priority.MEDIUM,
      boardId: boards[4].id, // Onboarding board
      source: 'portal',
      companyId: acme.id,
      assignedUserId: techJamie.id,
      slaId: slaStandard.id,
      dueAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      aiConfidenceScore: 0.95,
      aiRecommendedAction: 'Trigger onboarding automation runbook. All required systems identified. Estimated completion: 2 hours.',
    },
  })

  const ticket3 = await prisma.ticket.create({
    data: {
      title: 'CRITICAL: Suspected ransomware activity on file server',
      description: 'Multiple files on FS01 have been encrypted with .locked extension. File access logs show abnormal write patterns starting at 02:17 AM. Approximately 15,000 files affected. Server has been isolated from network. Backup from 11 PM last night is available.',
      status: TicketStatus.ASSIGNED,
      priority: Priority.CRITICAL,
      boardId: boardSecurity.id,
      categoryId: catIncident.id,
      subcategory: 'Ransomware',
      source: 'phone',
      companyId: meridian.id,
      contactId: contactMark.id,
      assignedUserId: techJamie.id,
      assignedTeamId: teamSecurity.id,
      slaId: slaPriority.id,
      dueAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      aiConfidenceScore: 0.96,
      aiRecommendedAction: 'IMMEDIATE: 1. Verify network isolation of FS01. 2. Engage incident response playbook. 3. Notify CISO and legal. 4. Preserve forensic evidence before restoration. 5. Initiate restore from last clean backup.',
    },
  })

  const ticket4 = await prisma.ticket.create({
    data: {
      title: 'Software license request - Adobe Creative Cloud',
      description: 'Marketing team is requesting 5 additional Adobe Creative Cloud licenses. Budget approval required from department head. Current contract with Adobe allows adding licenses mid-term.',
      status: TicketStatus.AWAITING_APPROVAL,
      priority: Priority.LOW,
      boardId: boardAccess.id,
      categoryId: catAccess.id,
      source: 'portal',
      companyId: techstart.id,
      contactId: contactSarah.id,
      slaId: slaStandard.id,
      dueAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      aiConfidenceScore: 0.78,
      aiRecommendedAction: 'Standard license procurement workflow. Requires manager approval. Estimated cost: $2,750/year for 5 seats.',
    },
  })

  const ticket5 = await prisma.ticket.create({
    data: {
      title: 'Laptop battery replacement - MacBook Pro',
      description: 'User reports MacBook Pro battery not holding charge. Coconut Battery app shows battery health at 62%. Device is 2 years old and still under AppleCare. Serial: C02XG2JVJHD2.',
      status: TicketStatus.RESOLVED,
      priority: Priority.MEDIUM,
      boardId: boardServiceDesk.id,
      categoryId: catHardware.id,
      subcategory: 'Laptop',
      source: 'portal',
      companyId: acme.id,
      assignedUserId: techAlex.id,
      slaId: slaStandard.id,
      resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      aiConfidenceScore: 0.92,
      aiRecommendedAction: 'Device is under AppleCare warranty. Schedule Apple Store appointment for battery replacement at no cost.',
    },
  })

  const ticket6 = await prisma.ticket.create({
    data: {
      title: 'MFA setup for new Microsoft 365 accounts',
      description: 'Need to configure Microsoft Authenticator MFA for 8 new M365 accounts created during TechStart expansion. Users are remote and will need guided setup via Teams call.',
      status: TicketStatus.NEW,
      priority: Priority.MEDIUM,
      boardId: boardAccess.id,
      categoryId: catAccess.id,
      subcategory: 'MFA Setup',
      source: 'api',
      companyId: techstart.id,
      contactId: contactSarah.id,
      slaId: slaPriority.id,
      aiConfidenceScore: 0.89,
      aiRecommendedAction: 'Bulk MFA enrollment via Azure AD portal. Send setup guide to users. Schedule 15-min Teams sessions for those needing assistance.',
    },
  })

  const ticket7 = await prisma.ticket.create({
    data: {
      title: 'Printer offline - HP LaserJet on 3rd floor',
      description: 'HP LaserJet Pro M404n on 3rd floor is showing offline in print queue for all users. Network ping is successful (192.168.1.105) but print jobs are queuing without printing. Printer was working yesterday.',
      status: TicketStatus.AWAITING_USER,
      priority: Priority.LOW,
      boardId: boardServiceDesk.id,
      categoryId: catHardware.id,
      subcategory: 'Printer',
      source: 'email',
      companyId: acme.id,
      contactId: contactJohn.id,
      assignedUserId: techAlex.id,
      slaId: slaStandard.id,
    },
  })

  const ticket8 = await prisma.ticket.create({
    data: {
      title: 'Cloud infrastructure scaling - AWS RDS',
      description: 'Production RDS PostgreSQL instance (db.t3.medium) CPU consistently at 85-90% during business hours. Need to evaluate upgrade options. Current monthly cost: $180. Recommended upgrade to db.t3.large ($360/mo) or consider read replicas.',
      status: TicketStatus.AI_TRIAGE,
      priority: Priority.HIGH,
      boardId: boardInfra.id,
      source: 'monitoring',
      companyId: techstart.id,
      slaId: slaPriority.id,
      aiConfidenceScore: 0.73,
      aiRecommendedAction: 'Performance bottleneck identified. Recommend: 1. Immediate: Enable Performance Insights. 2. Short-term: Add read replica for reporting queries. 3. Medium-term: Evaluate instance class upgrade. Estimated impact: High availability risk without action.',
    },
  })

  const ticket9 = await prisma.ticket.create({
    data: {
      title: 'Employee offboarding - Finance Director',
      description: 'Robert Chen, Finance Director at Meridian Health, last day is this Friday. Requires: Immediate email forwarding to CFO, SharePoint access revocation, QuickBooks admin rights removal, hardware recovery (laptop + monitors), final data backup, and compliance documentation.',
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      boardId: boards[4].id, // Onboarding/Offboarding
      source: 'portal',
      companyId: meridian.id,
      contactId: contactMark.id,
      assignedUserId: techJamie.id,
      slaId: slaStandard.id,
      dueAt: new Date(Date.now() + 96 * 60 * 60 * 1000),
    },
  })

  const ticket10 = await prisma.ticket.create({
    data: {
      title: 'Phishing email campaign targeting finance team',
      description: 'Security team has identified an active phishing campaign targeting Acme finance department. 3 users received emails impersonating CFO requesting urgent wire transfer. One user clicked the link. Email headers indicate origin from compromised domain acmecorp-finance.net (note: not the real domain).',
      status: TicketStatus.ASSIGNED,
      priority: Priority.CRITICAL,
      boardId: boardSecurity.id,
      categoryId: catIncident.id,
      subcategory: 'Phishing',
      source: 'email',
      companyId: acme.id,
      contactId: contactJohn.id,
      assignedUserId: techJamie.id,
      assignedTeamId: teamSecurity.id,
      slaId: slaPriority.id,
      dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      aiConfidenceScore: 0.98,
      aiRecommendedAction: 'CRITICAL PHISHING INCIDENT: 1. Block domain acmecorp-finance.net at email gateway immediately. 2. Scan affected user workstation. 3. Reset credentials for user who clicked link. 4. Notify all finance staff via out-of-band communication. 5. Check for any initiated wire transfers.',
    },
  })

  console.log('✅ Tickets created')

  // Comments
  await prisma.comment.createMany({
    data: [
      {
        ticketId: ticket1.id,
        userId: techAlex.id,
        body: 'Confirmed - the VPN certificate expired yesterday. Root CA chain is intact. Pushing updated certificate package via Intune MDM to affected devices now.',
        isInternal: false,
      },
      {
        ticketId: ticket1.id,
        userId: techAlex.id,
        body: 'Internal note: 47 devices affected per Intune report. MDM push initiated. Should resolve within 30 minutes without user intervention.',
        isInternal: true,
      },
      {
        ticketId: ticket3.id,
        userId: techJamie.id,
        body: 'Server is isolated. Initiating forensic image of affected volumes before any restoration. CISO and legal notified. Incident response team on call.',
        isInternal: true,
      },
      {
        ticketId: ticket5.id,
        userId: techAlex.id,
        body: 'Battery replacement completed by Apple Store under AppleCare warranty. No cost to client. New battery at 100% capacity.',
        isInternal: false,
      },
    ],
  })

  // Automation run
  await prisma.automationRun.create({
    data: {
      ticketId: ticket2.id,
      runbookName: 'employee-onboarding-full',
      status: 'RUNNING',
      webhookUrl: 'https://n8n.gmi.internal/webhook/onboarding',
      output: JSON.stringify({
        steps: [
          { name: 'Create Azure AD account', status: 'COMPLETED' },
          { name: 'Assign M365 licenses', status: 'COMPLETED' },
          { name: 'Create GitHub account', status: 'COMPLETED' },
          { name: 'Add to Slack workspace', status: 'RUNNING' },
          { name: 'Setup Jira account', status: 'PENDING' },
          { name: 'Send welcome email', status: 'PENDING' },
        ],
      }),
    },
  })

  // AI Decision Logs
  await prisma.aIDecisionLog.createMany({
    data: [
      {
        ticketId: ticket1.id,
        model: 'gpt-4-turbo-preview',
        prompt: 'Analyze ticket and suggest resolution: Cannot connect to VPN - getting certificate error...',
        response: 'SSL certificate verification failure after Windows update. High confidence this is related to certificate expiration or Windows Update KB5034441 breaking certificate trust.',
        confidence: 0.87,
        action: 'SUGGEST_RESOLUTION',
      },
      {
        ticketId: ticket3.id,
        model: 'gpt-4-turbo-preview',
        prompt: 'Analyze security incident: Suspected ransomware activity on file server...',
        response: 'HIGH SEVERITY RANSOMWARE INCIDENT. File encryption pattern matches LockBit 3.0 signature. Immediate containment required.',
        confidence: 0.96,
        action: 'ESCALATE_CRITICAL',
      },
    ],
  })

  // Approvals
  await prisma.approval.create({
    data: {
      ticketId: ticket4.id,
      requestedById: techAlex.id,
      approverId: managerKate.id,
      status: 'PENDING',
    },
  })

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        ticketId: ticket1.id,
        userId: techAlex.id,
        action: 'STATUS_CHANGED',
        before: { status: 'NEW' },
        after: { status: 'IN_PROGRESS' },
      },
      {
        ticketId: ticket3.id,
        userId: adminUser.id,
        action: 'PRIORITY_CHANGED',
        before: { priority: 'HIGH' },
        after: { priority: 'CRITICAL' },
      },
    ],
  })

  // Knowledge Articles
  const articles = await Promise.all([
    prisma.knowledgeArticle.create({
      data: {
        title: 'How to Reset Your Microsoft 365 Password',
        body: `# Password Reset Guide\n\nFollow these steps to reset your Microsoft 365 password:\n\n## Self-Service Reset\n1. Go to https://aka.ms/sspr\n2. Enter your email address\n3. Verify your identity via authenticator app or backup email\n4. Create a new password following complexity requirements\n\n## Password Requirements\n- Minimum 12 characters\n- At least one uppercase letter\n- At least one number\n- At least one special character\n- Cannot reuse last 10 passwords\n\n## If Self-Service Doesn't Work\nContact the IT helpdesk at support@gmi.com or call x5500.`,
        category: 'Account Management',
        tags: ['password', 'microsoft-365', 'self-service', 'account'],
        isPublished: true,
        authorId: adminUser.id,
        viewCount: 342,
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        title: 'VPN Setup Guide - GlobalProtect',
        body: `# GlobalProtect VPN Setup\n\n## Windows Installation\n1. Download GlobalProtect from the IT portal\n2. Run the installer as Administrator\n3. Enter portal address: vpn.gmi.internal\n4. Login with your company credentials\n5. Complete MFA verification\n\n## macOS Installation\n1. Download the .pkg file from the IT portal\n2. Run the installer\n3. Grant system extension permissions in Security & Privacy\n4. Configure portal: vpn.gmi.internal\n\n## Troubleshooting\n- Certificate errors: Update your root CA bundle via Software Center\n- Connection failures: Verify internet connectivity and try alternate gateway\n- Performance issues: Use nearest regional gateway`,
        category: 'Network & Connectivity',
        tags: ['vpn', 'globalprotect', 'remote-work', 'setup'],
        isPublished: true,
        authorId: techAlex.id,
        viewCount: 891,
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        title: 'Phishing Email Identification and Reporting',
        body: `# Identifying and Reporting Phishing Emails\n\n## Warning Signs\n- Sender email doesn't match the display name\n- Urgent requests for money transfers or credentials\n- Suspicious links (hover to preview before clicking)\n- Grammar and spelling errors\n- Requests to bypass normal procedures\n\n## How to Report\n1. Do NOT click any links in the suspicious email\n2. Use the "Report Phishing" button in Outlook\n3. Or forward as attachment to: security@gmi.com\n4. If you clicked a link: immediately call x5911 (Security Hotline)\n\n## If You Clicked a Link\n- Call security hotline immediately: x5911\n- Do not enter any credentials\n- Disconnect from corporate network if possible\n- Do not panic - prompt reporting helps us contain the threat`,
        category: 'Security',
        tags: ['phishing', 'security', 'email', 'awareness'],
        isPublished: true,
        authorId: techJamie.id,
        viewCount: 1204,
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        title: 'Requesting New Software or Licenses',
        body: `# Software Request Process\n\n## Self-Service Portal\n1. Login to the IT Portal at portal.gmi.internal\n2. Navigate to Service Catalog > Software Requests\n3. Search for the software you need\n4. Submit the request form with business justification\n\n## Approval Process\n- Requests under $500/year: Auto-approved with manager notification\n- Requests $500-$5,000/year: Manager approval required (48hr SLA)\n- Requests over $5,000/year: Director + Finance approval required\n\n## Supported Software Catalog\nView our full approved software catalog at: portal.gmi.internal/catalog\n\n## Unsupported Software\nIf you need software not in the catalog, submit a new software evaluation request. Security review takes 5-10 business days.`,
        category: 'Software & Licensing',
        tags: ['software', 'license', 'procurement', 'approval'],
        isPublished: true,
        authorId: adminUser.id,
        viewCount: 567,
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        title: 'New Employee IT Checklist',
        body: `# New Employee IT Setup Checklist\n\n## Day 1 Checklist\n- [ ] Receive and activate company laptop\n- [ ] Login with temporary credentials from IT\n- [ ] Set new password (you'll be prompted)\n- [ ] Setup Microsoft Authenticator for MFA\n- [ ] Connect to corporate WiFi (SSID: Corp-Secure)\n- [ ] Install VPN client and test connection\n- [ ] Activate Microsoft 365 (Outlook, Teams, SharePoint)\n\n## Day 1 Applications\n- Email: Outlook (outlook.office.com)\n- Chat: Microsoft Teams\n- Video: Teams + Zoom\n- Documents: SharePoint / OneDrive\n\n## Getting Help\n- IT Helpdesk: support@gmi.com | x5500\n- Portal: portal.gmi.internal\n- Emergency: x5911\n\n## Required Training\nComplete all security awareness training in your first week via the Learning Portal.`,
        category: 'Onboarding',
        tags: ['new-employee', 'onboarding', 'checklist', 'setup'],
        isPublished: true,
        authorId: adminUser.id,
        viewCount: 445,
      },
    }),
  ])

  console.log('✅ Knowledge articles created')

  // Service Catalog Items
  await prisma.serviceCatalogItem.createMany({
    data: [
      {
        name: 'Password Reset',
        description: 'Reset your account password for any company system',
        category: 'Account Management',
        icon: 'KeyRound',
        boardId: boardAccess.id,
        isActive: true,
        order: 1,
        formSchema: JSON.stringify({
          fields: [
            { name: 'system', type: 'select', label: 'System', options: ['Microsoft 365', 'VPN', 'CRM', 'ERP', 'Other'] },
            { name: 'username', type: 'text', label: 'Username or Email' },
          ],
        }),
      },
      {
        name: 'New Software Request',
        description: 'Request installation of new software or additional licenses',
        category: 'Software & Licensing',
        icon: 'Package',
        boardId: boardServiceDesk.id,
        isActive: true,
        order: 2,
        formSchema: JSON.stringify({
          fields: [
            { name: 'software_name', type: 'text', label: 'Software Name', required: true },
            { name: 'version', type: 'text', label: 'Version (if specific)' },
            { name: 'license_count', type: 'number', label: 'Number of Licenses', default: 1 },
            { name: 'business_justification', type: 'textarea', label: 'Business Justification', required: true },
            { name: 'urgency', type: 'select', label: 'Urgency', options: ['Low', 'Medium', 'High'] },
          ],
        }),
      },
      {
        name: 'New Employee Setup',
        description: 'Initiate IT onboarding for a new team member',
        category: 'HR & Onboarding',
        icon: 'UserPlus',
        boardId: boards[4].id,
        isActive: true,
        order: 3,
        formSchema: JSON.stringify({
          fields: [
            { name: 'first_name', type: 'text', label: 'First Name', required: true },
            { name: 'last_name', type: 'text', label: 'Last Name', required: true },
            { name: 'job_title', type: 'text', label: 'Job Title', required: true },
            { name: 'department', type: 'text', label: 'Department', required: true },
            { name: 'start_date', type: 'date', label: 'Start Date', required: true },
            { name: 'manager_email', type: 'email', label: 'Manager Email', required: true },
            { name: 'equipment_type', type: 'select', label: 'Equipment Type', options: ['MacBook Pro M3', 'Dell Latitude', 'HP EliteBook', 'Desktop'], required: true },
            { name: 'software_needed', type: 'multiselect', label: 'Additional Software', options: ['Adobe Creative Cloud', 'Figma', 'AutoCAD', 'QuickBooks', 'Salesforce'] },
          ],
        }),
      },
      {
        name: 'Employee Offboarding',
        description: 'Initiate IT offboarding for a departing team member',
        category: 'HR & Onboarding',
        icon: 'UserMinus',
        boardId: boards[4].id,
        isActive: true,
        order: 4,
        formSchema: JSON.stringify({
          fields: [
            { name: 'employee_name', type: 'text', label: 'Employee Full Name', required: true },
            { name: 'employee_email', type: 'email', label: 'Employee Email', required: true },
            { name: 'last_day', type: 'date', label: 'Last Working Day', required: true },
            { name: 'data_retention', type: 'select', label: 'Data Retention', options: ['Transfer to manager', 'Archive 90 days', 'Delete immediately'], required: true },
            { name: 'equipment_return', type: 'select', label: 'Equipment Return Method', options: ['In-person', 'Ship to office', 'Courier pickup'], required: true },
            { name: 'email_forward', type: 'email', label: 'Forward Email To (optional)' },
          ],
        }),
      },
      {
        name: 'VPN Access Request',
        description: 'Request VPN access for remote work',
        category: 'Network & Access',
        icon: 'Shield',
        boardId: boardAccess.id,
        isActive: true,
        order: 5,
        formSchema: JSON.stringify({
          fields: [
            { name: 'access_type', type: 'select', label: 'Access Type', options: ['Full tunnel', 'Split tunnel', 'Site-to-site'] },
            { name: 'duration', type: 'select', label: 'Duration', options: ['Permanent', 'Temporary (30 days)', 'Project-based'] },
            { name: 'justification', type: 'textarea', label: 'Business Justification', required: true },
          ],
        }),
      },
      {
        name: 'Hardware Request',
        description: 'Request new hardware equipment or replacement',
        category: 'Hardware',
        icon: 'Monitor',
        boardId: boardServiceDesk.id,
        isActive: true,
        order: 6,
        formSchema: JSON.stringify({
          fields: [
            { name: 'hardware_type', type: 'select', label: 'Hardware Type', options: ['Laptop', 'Desktop', 'Monitor', 'Keyboard/Mouse', 'Headset', 'Webcam', 'Docking Station', 'Printer', 'Other'], required: true },
            { name: 'reason', type: 'select', label: 'Request Reason', options: ['New employee', 'Replacement (broken)', 'Upgrade', 'Additional equipment'], required: true },
            { name: 'description', type: 'textarea', label: 'Description / Specifications' },
            { name: 'urgency', type: 'select', label: 'Urgency', options: ['Standard (5-7 days)', 'Urgent (2-3 days)', 'Critical (next day)'] },
          ],
        }),
      },
      {
        name: 'Access Permission Change',
        description: 'Request changes to system access or permissions',
        category: 'Account Management',
        icon: 'Lock',
        boardId: boardAccess.id,
        isActive: true,
        order: 7,
        formSchema: JSON.stringify({
          fields: [
            { name: 'system', type: 'text', label: 'System / Application', required: true },
            { name: 'current_access', type: 'textarea', label: 'Current Access Level' },
            { name: 'requested_access', type: 'textarea', label: 'Requested Access Level', required: true },
            { name: 'justification', type: 'textarea', label: 'Business Justification', required: true },
            { name: 'manager_approval', type: 'email', label: 'Manager Email for Approval', required: true },
          ],
        }),
      },
      {
        name: 'Report Security Incident',
        description: 'Report a suspected security incident or data breach',
        category: 'Security',
        icon: 'AlertTriangle',
        boardId: boardSecurity.id,
        isActive: true,
        order: 8,
        formSchema: JSON.stringify({
          fields: [
            { name: 'incident_type', type: 'select', label: 'Incident Type', options: ['Phishing email', 'Malware/Virus', 'Unauthorized access', 'Data loss', 'Lost/stolen device', 'Other'], required: true },
            { name: 'description', type: 'textarea', label: 'Describe what happened', required: true },
            { name: 'when_occurred', type: 'datetime', label: 'When did this occur?' },
            { name: 'systems_affected', type: 'text', label: 'Systems/Data affected' },
            { name: 'clicked_link', type: 'boolean', label: 'Did you click any links or download files?' },
          ],
        }),
      },
    ],
  })

  console.log('✅ Service catalog created')

  // Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: techAlex.id,
        type: 'TICKET_ASSIGNED',
        title: 'Ticket Assigned',
        body: 'Ticket #1 "Cannot connect to VPN" has been assigned to you',
        isRead: false,
        ticketId: ticket1.id,
      },
      {
        userId: techJamie.id,
        type: 'TICKET_CRITICAL',
        title: 'Critical Ticket Alert',
        body: 'CRITICAL: Suspected ransomware activity at Meridian Health requires immediate attention',
        isRead: false,
        ticketId: ticket3.id,
      },
      {
        userId: managerKate.id,
        type: 'APPROVAL_REQUESTED',
        title: 'Approval Required',
        body: 'Adobe Creative Cloud license request requires your approval',
        isRead: false,
        ticketId: ticket4.id,
      },
    ],
  })

  console.log('✅ Notifications created')

  console.log('\n🎉 Seed completed successfully!')
  console.log(`\nCreated:`)
  console.log(`  - 4 companies`)
  console.log(`  - 2 SLA profiles`)
  console.log(`  - 3 contacts`)
  console.log(`  - 4 users`)
  console.log(`  - 3 teams`)
  console.log(`  - ${boards.length} boards`)
  console.log(`  - 5 categories`)
  console.log(`  - 2 assets`)
  console.log(`  - 10 tickets`)
  console.log(`  - ${articles.length} knowledge articles`)
  console.log(`  - 8 service catalog items`)
  console.log(`\nAdmin login: admin@gmi.com`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
