# Quick Start Guide

Follow these steps to get the application running:

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Prisma, and other dependencies.

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file (if it exists)
cp .env.example .env

# Or create it manually
```

Add the following variables to your `.env` file:

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/ai_assignment_generator?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"

# OpenAI API (Required for AI generation)
OPENAI_API_KEY="sk-your-openai-api-key"

# SendGrid Email (Optional - for sending emails)
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### Generate NEXTAUTH_SECRET

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
```

On Mac/Linux:
```bash
openssl rand -base64 32
```

## Step 3: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL if you haven't already
2. Create a database:
```sql
CREATE DATABASE ai_assignment_generator;
```

3. Update your `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ai_assignment_generator?schema=public"
```

### Option B: Use a Cloud Database (Recommended for quick start)

- **Supabase** (Free tier available): https://supabase.com
- **Neon** (Free tier): https://neon.tech
- **Railway**: https://railway.app

Copy the connection string they provide to your `DATABASE_URL`.

## Step 4: Set Up Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 5: Create Admin User

```bash
# With custom values
node scripts/create-admin.js admin@example.com admin123 "Admin User"

# Or use defaults (admin@example.com / admin123)
node scripts/create-admin.js
```

## Step 6: Get API Keys

### OpenAI API Key (Required)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

### SendGrid API Key (Optional - for email)
1. Go to https://sendgrid.com
2. Create an account and verify your email
3. Create an API key
4. Add it to your `.env` file

**Note:** Without SendGrid, you can still use the app, but email sending won't work.

## Step 7: Run the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

## Step 8: Login

Use the admin credentials you created:
- Email: `admin@example.com` (or what you specified)
- Password: `admin123` (or what you specified)

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Make sure PostgreSQL is running
2. Verify your `DATABASE_URL` is correct
3. Check that the database exists

### Prisma Errors

```bash
# Reset Prisma client
npx prisma generate

# If schema changed, push again
npx prisma db push
```

### Port Already in Use

If port 3000 is busy:
```bash
# Use a different port
PORT=3001 npm run dev
```

### Missing Dependencies

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Create a Therapist Account**: You can create therapist users through the admin panel or directly in the database
2. **Add Clients**: Use the dashboard to add your first client
3. **Create Sessions**: Link sessions to clients
4. **Generate Assignments**: Use the AI generator to create your first assignment

## Useful Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push
```

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the Prisma schema in `prisma/schema.prisma`
- Check API routes in `app/api/` directory




