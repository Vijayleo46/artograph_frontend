# How to Set Up OpenAI API Key

## Step 1: Get Your OpenAI API Key

1. **Go to OpenAI Platform:**
   - Visit: https://platform.openai.com/api-keys
   - Sign up or log in to your OpenAI account

2. **Create a New API Key:**
   - Click "Create new secret key"
   - Give it a name (e.g., "Therapy Assignment Generator")
   - Copy the key immediately (you won't see it again!)
   - It will look like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Add to .env File

1. **Open your `.env` file** in the project root

2. **Find this line:**
   ```
   OPENAI_API_KEY="sk-your-openai-api-key-here"
   ```

3. **Replace it with your actual key:**
   ```
   OPENAI_API_KEY="sk-proj-your-actual-key-here"
   ```

4. **Save the file**

## Step 3: Restart Your Dev Server

1. **Stop the server** (Press `Ctrl+C` in the terminal)

2. **Start it again:**
   ```bash
   npm run dev
   ```

## Step 4: Verify It Works

Try generating an assignment again. It should work now!

## Important Notes

- ⚠️ **Never commit your API key to Git!** The `.env` file should be in `.gitignore`
- 💰 **OpenAI charges per use** - Check your usage at https://platform.openai.com/usage
- 🔑 **Keep your key secret** - Don't share it publicly

## Troubleshooting

### "Invalid API key"
- Make sure there are no extra spaces
- Make sure the key starts with `sk-`
- Copy the entire key (they're long!)

### "Insufficient quota"
- You need to add payment method to OpenAI account
- Go to: https://platform.openai.com/account/billing

### Still not working?
1. Double-check the `.env` file is in the project root
2. Make sure you restarted the dev server
3. Check the terminal for any error messages




