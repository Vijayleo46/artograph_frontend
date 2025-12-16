# Setup Instructions - Step by Step

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a file named `.env` in the root directory with this content:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_assignment_generator?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string"

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-your-key-here"

# SendGrid (Optional - Get from https://sendgrid.com)
SENDGRID_API_KEY="SG.your-key-here"
SENDGRID_FROM_EMAIL="noreply@example.com"
```

**Important:** Replace the values above with your actual credentials!

### 3. Set Up Database

**Option 1: Use Supabase (Easiest - Free)**
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Paste it as your `DATABASE_URL` in `.env`

**Option 2: Local PostgreSQL**
1. Install PostgreSQL
2. Create database: `CREATE DATABASE ai_assignment_generator;`
3. Update `DATABASE_URL` with your credentials

### 4. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Create Admin User
```bash
node scripts/create-admin.js
```
This creates: `admin@example.com` / `admin123`

### 6. Start the App
```bash
npm run dev
```

### 7. Open Browser
Go to: **http://localhost:3000**

Login with:
- Email: `admin@example.com`
- Password: `admin123`

## ✅ That's it! You're ready to go!

---

## 📝 Detailed Steps

### Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ PostgreSQL database (or use Supabase/Neon)

### Generate NEXTAUTH_SECRET

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET` in `.env`

### Get OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to `.env` as `OPENAI_API_KEY`

**Note:** You'll need to add payment method to OpenAI account (they have free credits)

### Get SendGrid API Key (Optional)

1. Visit: https://sendgrid.com
2. Sign up for free account
3. Verify your email
4. Go to Settings → API Keys
5. Create API key with "Full Access"
6. Copy and add to `.env` as `SENDGRID_API_KEY`

**Note:** Without SendGrid, the app works but email sending is disabled.

## 🐛 Common Issues

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection error
- Check PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Make sure database exists

### "Prisma Client not generated"
```bash
npx prisma generate
```

### Port 3000 already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
set PORT=3001 && npm run dev
```

## 🎯 Next Steps After Setup

1. **Login** with admin credentials
2. **Add a Client** from the Clients page
3. **Create a Session** for that client
4. **Generate an Assignment** using AI
5. **Edit and Send** the assignment

## 📚 Additional Resources

- Full documentation: [README.md](README.md)
- Quick start: [QUICKSTART.md](QUICKSTART.md)
- Database schema: `prisma/schema.prisma`




