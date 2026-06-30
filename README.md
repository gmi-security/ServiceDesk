# GMI ServiceOS

A modern, AI-assisted IT service management platform built for managed service providers. GMI ServiceOS combines intelligent ticket triage, workflow automation, and a self-service portal into a single unified interface.

## Features

- **AI-Assisted Triage** — GPT-4 powered ticket analysis, categorization, and resolution recommendations
- **Workflow Automation** — n8n-integrated runbooks for onboarding, offboarding, access management, and more
- **Multi-Board Ticketing** — Dedicated boards for Service Desk, Security, Infrastructure, Access Management, and more
- **Approval Workflows** — Built-in approval chains for license requests, access changes, and budget items
- **Self-Service Portal** — End-user facing catalog with structured intake forms
- **Knowledge Base** — Searchable article library with view tracking
- **Asset Management** — Track hardware and software assets linked to companies and contacts
- **SLA Tracking** — Configurable SLA profiles per company with due-date enforcement
- **Audit Logging** — Full change history on every ticket
- **Azure AD SSO** — Single sign-on via Microsoft Entra ID (formerly Azure Active Directory)
- **Dark Mode UI** — Purpose-built dark theme optimized for NOC and helpdesk environments

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | Auth.js v5 (NextAuth) with Azure AD |
| Styling | Tailwind CSS |
| AI | OpenAI GPT-4 Turbo |
| Automation | n8n (self-hosted) |
| Icons | Lucide React |
| UI Primitives | Headless UI |

## Prerequisites

- Node.js 18.17 or later
- PostgreSQL 14 or later
- An Azure AD application registration (for SSO)
- OpenAI API key
- n8n instance (optional, for automation features)

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/gmi/serviceos.git
cd gmi-serviceos
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all required values. At minimum you need:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Your app URL (e.g. `http://localhost:3000`)
- `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` — From your Azure app registration
- `OPENAI_API_KEY` — For AI triage features

### 3. Set up the database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default login (after seeding)

The seed creates the following users. Configure Azure AD SSO and ensure these emails match accounts in your tenant, or update the seed with your own emails.

| Name | Email | Role |
|---|---|---|
| Admin User | admin@gmi.com | Admin |
| Alex Rivera | alex.rivera@gmi.com | Tech |
| Jamie Chen | jamie.chen@gmi.com | Tech |
| Kate Morrison | kate.morrison@gmi.com | Manager |

## Database Management

```bash
# Open Prisma Studio (visual database browser)
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset and reseed database
npx prisma db push --force-reset && npm run db:seed
```

## Project Structure

```
gmi-serviceos/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seed
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Main application pages
│   │   ├── api/             # API route handlers
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Base UI components (buttons, inputs, modals)
│   │   ├── tickets/         # Ticket-specific components
│   │   ├── layout/          # Navigation, sidebar, header
│   │   └── shared/          # Cross-feature shared components
│   ├── lib/                 # Utility libraries
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # Auth.js configuration
│   │   ├── openai.ts        # OpenAI client and helpers
│   │   └── utils.ts         # General utilities
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── .env.example             # Environment variable template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Boards

The platform ships with 9 pre-configured boards:

1. **Service Desk** — General IT support, hardware, software, network issues
2. **Security** — Incidents, vulnerabilities, phishing, malware response
3. **Infrastructure** — Servers, networking, cloud, datacenter operations
4. **Access Management** — User provisioning, permissions, password resets
5. **Onboarding & Offboarding** — Employee IT lifecycle management
6. **Automation** — Runbook execution tracking and results
7. **Escalations** — Priority escalations and critical incidents
8. **Customer Success** — Client relationship and satisfaction management
9. **Internal GMI** — Internal operations and projects

## AI Triage

When a ticket is created, the AI triage engine:

1. Analyzes the ticket title and description
2. Suggests board, category, and subcategory classification
3. Recommends priority based on impact and urgency signals
4. Proposes a resolution action or next step
5. Assigns a confidence score (0.0 - 1.0)
6. Logs the full prompt/response for audit and review

Configure AI behavior via environment variables:
- `FEATURE_AI_TRIAGE` — Enable/disable AI triage (`true`/`false`)
- `OPENAI_MODEL` — Model to use (default: `gpt-4-turbo-preview`)
- `OPENAI_TEMPERATURE` — Response creativity (default: `0.2` for consistency)

## Automation

n8n runbooks are triggered via webhook when automation-eligible tickets are created or reach specific statuses. Configure your n8n instance URL and webhook secret in `.env.local`.

Built-in runbooks include:
- `employee-onboarding-full` — Full new hire IT setup
- `employee-offboarding` — Secure offboarding and access revocation
- `password-reset-self-service` — Automated password reset flow
- `access-provision` — Permission provisioning across systems
- `software-install` — Remote software deployment via MDM

## ConnectWise and ServiceNow Integration

GMI ServiceOS can sync tickets bidirectionally with ConnectWise Manage and ServiceNow. Configure the integration credentials in `.env.local`. Sync behavior is controlled per-board via the admin settings panel.

## Deployment

### Production build

```bash
npm run build
npm run start
```

### Environment checklist for production

- Set `APP_ENV=production`
- Set `APP_LOG_LEVEL=warn` or `error`
- Use a strong `NEXTAUTH_SECRET` (32+ bytes of entropy)
- Set `NEXTAUTH_URL` to your production domain with HTTPS
- Use a managed PostgreSQL service with connection pooling
- Configure SMTP for email notifications
- Enable all desired `FEATURE_*` flags

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate TypeScript types
3. Ensure `npm run lint` passes
4. Submit a pull request with a clear description

## License

Proprietary — GMI Technologies. All rights reserved.
