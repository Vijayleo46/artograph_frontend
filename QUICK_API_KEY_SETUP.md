# Quick API Key Setup

## Your Current Status

Your `.env` file currently has:
```
OPENAI_API_KEY="your-real-openai-key-here"
```

This is still a **placeholder** - you need to replace it with your **actual** OpenAI API key.

## Get Your Real API Key (2 minutes)

### Option 1: If you already have an OpenAI account

1. Go to: **https://platform.openai.com/api-keys**
2. Click **"Create new secret key"**
3. Copy the key (it will look like: `sk-proj-abc123xyz...`)
4. Replace `your-real-openai-key-here` in your `.env` file

### Option 2: If you need to create an account

1. Go to: **https://platform.openai.com/signup**
2. Sign up with email or Google
3. Add a payment method (required for API access)
4. Go to: **https://platform.openai.com/api-keys**
5. Create and copy your API key

## Update Your .env File

**Change this:**
```
OPENAI_API_KEY="your-real-openai-key-here"
```

**To this (with your real key):**
```
OPENAI_API_KEY="sk-proj-abc123xyz789..."
```

## After Updating

1. **Save the .env file**
2. **Restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```
3. **Try generating an assignment again**

## What a Real Key Looks Like

- Starts with `sk-` or `sk-proj-`
- Very long (50+ characters)
- Example: `sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

## Still Having Issues?

- Make sure there are **no spaces** around the key
- Make sure you **saved** the .env file
- Make sure you **restarted** the dev server
- Check that your OpenAI account has **credits/quota**




