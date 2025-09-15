# 🏗️ Kroolo BSM - Enterprise Business Service Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

## ✨ Overview

Kroolo BSM is a comprehensive **Business Service Management (BSM)** platform designed for modern enterprises. Built with cutting-edge technologies, it provides a complete ITSM solution with AI-powered automation, intelligent workflow management, and enterprise-grade security.

### 🎯 Key Features

- **🎫 Advanced Ticket Management** - Kanban/List views, AI classification, bulk operations
- **⚡ Workflow Automation** - Visual builder with drag-drop interface
- **📚 Knowledge Base** - AI-enhanced content management and search
- **📊 Real-time Analytics** - Comprehensive dashboards and custom reports
- **🏢 Multi-tenant Architecture** - Organization isolation and role-based access
- **🔐 Enterprise Security** - SOC 2 compliant with end-to-end encryption
- **🌐 Global Integrations** - 100+ third-party tools and services
- **🤖 AI-Powered Features** - Smart classification, suggestions, and automation
- **📱 Mobile-First Design** - Responsive across all device sizes
- **♿ Accessibility** - WCAG 2.1 AA compliant

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- **Supabase** account and project
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/kroolo-bsm.git
   cd kroolo-bsm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database setup**
   ```bash
   # Start the development server first
   npm run dev
   
   # Then setup the database (in another terminal)
   curl -X POST http://localhost:3000/api/setup \
     -H "Content-Type: application/json" \
     -d '{"mode": "demo", "seed": true}'
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Demo credentials: `admin@demo.kroolo.com` / `demo123456`

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:setup        # Complete development setup

# Building
npm run build            # Production build
npm run start            # Start production server

# Quality & Testing
npm run lint             # Run ESLint
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run Playwright E2E tests

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with demo data

# Deployment
npm run deploy           # Deploy to production
npm run backup           # Backup database
```

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth, NextAuth.js
- **State Management**: Zustand, React Query
- **File Storage**: Supabase Storage / AWS S3
- **Real-time**: Supabase Realtime / Pusher
- **AI/ML**: OpenAI GPT, Anthropic Claude
- **Monitoring**: Sentry, LogRocket
- **Testing**: Jest, Playwright, Testing Library

### Project Structure

```
kroolo-bsm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (onboarding)/      # Onboarding flow
│   │   ├── (dashboard)/       # Main application
│   │   └── api/               # API endpoints
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── features/         # Feature-specific components
│   │   └── providers/        # Context providers
│   ├── lib/                  # Utilities and configurations
│   │   ├── config/          # Configuration files
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── store/               # State management
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
├── tests/                   # Test files
├── docs/                    # Documentation
└── scripts/                 # Build and deployment scripts
```

## 🔧 Configuration

### Environment Variables

Key environment variables needed for the application:

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

See `env.example` for the complete list of configuration options.

### Database Setup

The application uses Supabase PostgreSQL with the following key tables:

- **organizations** - Multi-tenant organization data
- **users** - User profiles and authentication
- **departments** - Organizational structure
- **tickets** - Service requests and incidents
- **workflows** - Automated business processes
- **knowledge_articles** - Knowledge base content
- **activity_logs** - Audit trail and activity tracking

## 🎨 Features Deep Dive

### Ticket Management
- **Kanban Board** - Visual ticket workflow management
- **Advanced Filters** - Status, priority, assignee, date ranges
- **Bulk Operations** - Mass update, assignment, and status changes
- **AI Classification** - Automatic categorization and priority assignment
- **SLA Tracking** - Response and resolution time monitoring

### Workflow Automation
- **Visual Builder** - Drag-and-drop workflow designer
- **Smart Routing** - Intelligent ticket assignment
- **Escalation Rules** - Automatic escalation based on conditions
- **Integration Hooks** - Connect with external systems
- **Performance Metrics** - Workflow efficiency tracking

### Knowledge Base
- **Rich Editor** - Full-featured content creation
- **AI-Enhanced Search** - Semantic search with relevance scoring
- **Category Management** - Hierarchical content organization
- **Version Control** - Track changes and revisions
- **Usage Analytics** - Article performance metrics

### Analytics & Reporting
- **Real-time Dashboards** - Live performance metrics
- **Custom Reports** - Build reports with drag-and-drop
- **Predictive Analytics** - AI-powered insights and forecasting
- **Export Options** - PDF, Excel, and API exports
- **Scheduled Reports** - Automated report delivery

## 🔐 Security

### Authentication & Authorization
- **Multi-factor Authentication** - TOTP and SMS support
- **Role-based Access Control** - Granular permission system
- **Session Management** - Secure token handling
- **OAuth Integration** - Google, Microsoft, GitHub SSO

### Data Protection
- **End-to-end Encryption** - Data encrypted at rest and in transit
- **Audit Logging** - Comprehensive activity tracking
- **Data Backup** - Automated backup and recovery
- **GDPR Compliance** - Data privacy and user rights

### Infrastructure Security
- **SOC 2 Type II** - Certified security controls
- **Penetration Testing** - Regular security assessments
- **Vulnerability Scanning** - Automated security monitoring
- **Incident Response** - 24/7 security monitoring

## 🚀 Deployment

### Development
```bash
npm run dev:setup    # One-command setup
npm run dev         # Start development server
```

### Production

#### Vercel (Recommended)
```bash
npm run build       # Build for production
vercel --prod      # Deploy to Vercel
```

#### Docker
```bash
docker build -t kroolo-bsm .
docker run -p 3000:3000 kroolo-bsm
```

#### Manual Deployment
```bash
npm run build      # Build application
npm run start      # Start production server
```

## 📊 Performance

### Optimization Features
- **Code Splitting** - Automatic bundle optimization
- **Image Optimization** - Next.js Image component
- **Caching Strategy** - Multi-level caching implementation
- **CDN Integration** - Global content delivery
- **Database Optimization** - Query optimization and indexing

### Performance Metrics
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: All metrics in green
- **Bundle Size**: < 200KB initial load
- **Time to Interactive**: < 2 seconds

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: API and component testing
- **E2E Tests**: Playwright for full user journeys
- **Performance Tests**: Load testing with Artillery
- **Security Tests**: OWASP ZAP integration

```bash
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:e2e         # Run E2E tests
```

## 📚 Documentation

- [**API Documentation**](docs/API.md) - Complete API reference
- [**Component Library**](docs/COMPONENTS.md) - UI component documentation
- [**Architecture Guide**](docs/ARCHITECTURE.md) - System design and patterns
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Production deployment instructions
- [**Contributing Guide**](docs/CONTRIBUTING.md) - Development workflow and guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Community Support
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community Q&A and discussions
- **Discord** - Real-time community chat

### Enterprise Support
- **24/7 Support** - Priority support for enterprise customers
- **Dedicated CSM** - Customer success management
- **Training** - On-site and remote training options
- **Custom Development** - Tailored solutions and integrations

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [OpenAI](https://openai.com/) - AI-powered features
- All our contributors and the open source community

---

<div align="center">
  <p><strong>Built with ❤️ by the Kroolo Team</strong></p>
  <p>
    <a href="https://kroolo.com">Website</a> •
    <a href="https://docs.kroolo.com">Documentation</a> •
    <a href="https://status.kroolo.com">Status</a> •
    <a href="mailto:support@kroolo.com">Support</a>
  </p>
</div>
