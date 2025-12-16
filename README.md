# AI Assignment Generator - Therapy Management System

A comprehensive Next.js application for therapists to generate, manage, and send AI-powered therapy assignments to clients.

## Features

### Version 1 (Current)
- **AI Assignment Generator**: Generate personalized CBT assignments using OpenAI
- **Assignment Editor**: WYSIWYG editor for customizing generated assignments
- **Client & Session Management**: Link assignments to specific clients and therapy sessions
- **Email Integration**: Send assignments directly to clients via SendGrid
- **Public Library**: Community-contributed assignment templates with filtering
- **Admin Moderation**: Admin dashboard for approving/rejecting public templates
- **Role-Based Access**: Therapist, Admin, and Client (v2) roles

### Version 2 (Planned)
- Client portal for viewing and submitting assignments
- Mobile-responsive design
- Assignment completion tracking
- Analytics and reporting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Editor**: TipTap (WYSIWYG)
- **AI**: OpenAI GPT-4
- **Email**: SendGrid

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- SendGrid API key (optional, for email sending)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Ai-generator-react
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a random secret (e.g., `openssl rand -base64 32`)
- `OPENAI_API_KEY`: Your OpenAI API key
- `SENDGRID_API_KEY`: Your SendGrid API key (optional)
- `SENDGRID_FROM_EMAIL`: Sender email address

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Create an admin user:
```bash
node scripts/create-admin.js admin@example.com admin123 "Admin User"
```

Or use default values:
```bash
node scripts/create-admin.js
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── assignments/      # Assignment-related components
│   ├── clients/          # Client management components
│   ├── library/          # Public library components
│   ├── admin/            # Admin dashboard components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── ai.ts             # OpenAI integration
│   └── email.ts          # SendGrid integration
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript type definitions
```

## User Roles

### Therapist
- Generate AI assignments
- Edit and customize assignments
- Manage clients and sessions
- Send assignments via email
- Save private templates
- Publish templates to public library

### Admin
- All therapist permissions
- Approve/reject public templates
- View system statistics
- Manage all accounts

### Client (v2)
- Receive assignments via email (v1)
- View assignments in portal (v2)
- Submit completed assignments (v2)

## API Routes

- `POST /api/assignments/generate` - Generate AI assignment
- `GET /api/assignments` - List assignments
- `GET /api/assignments/[id]` - Get assignment details
- `PUT /api/assignments/[id]` - Update assignment
- `POST /api/assignments/[id]/send` - Send assignment via email
- `POST /api/assignments/[id]/clone` - Clone assignment
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create session
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `PUT /api/templates/[id]` - Update template status

## Database Schema

- **User**: Therapists, admins, and clients
- **Client**: Client profiles with therapy information
- **Session**: Therapy sessions linked to clients
- **Assignment**: Generated assignments linked to clients and sessions
- **Template**: Reusable assignment templates (private/public)
- **EmailLog**: Email delivery tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

