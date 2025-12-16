# Troubleshooting Assignment Generation

## Common Errors

### "Failed to generate assignment. Please try again."

This error can have several causes:

#### 1. OpenAI API Key Not Set

**Error:** "OpenAI API key is not configured"

**Solution:**
1. Open your `.env` file
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY="sk-your-actual-api-key-here"
   ```
3. Get your API key from: https://platform.openai.com/api-keys
4. Restart your dev server

#### 2. Invalid API Key

**Error:** "OpenAI API key is missing or invalid"

**Solution:**
- Make sure your API key starts with `sk-`
- Verify the key is correct in your `.env` file
- Check that you have credits/quota in your OpenAI account

#### 3. Database Issues

**Error:** Database-related errors

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

#### 4. Missing Therapist

**Error:** "Therapist not found"

**Solution:**
```bash
# Create default therapist
npm run setup
```

## Check Your Setup

1. **Verify .env file exists:**
   ```bash
   # Should contain:
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="sk-..."
   ```

2. **Check database:**
   ```bash
   npx prisma studio
   # Opens at http://localhost:5555
   ```

3. **Verify OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Make sure you have an active key
   - Check your account has credits

## Still Having Issues?

1. Check the browser console for detailed error messages
2. Check the terminal where `npm run dev` is running
3. Verify all environment variables are set correctly
4. Make sure you've restarted the dev server after changing .env




