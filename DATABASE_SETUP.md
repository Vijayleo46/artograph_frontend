# Database Setup - SQLite

The application now uses **SQLite** which is much simpler - no separate database server needed!

## Quick Setup

1. **Create `.env` file** (if it doesn't exist):
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="any-random-string"
   OPENAI_API_KEY="sk-your-key-here"
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Create Database:**
   ```bash
   npx prisma db push
   ```

4. **That's it!** The database file `dev.db` will be created automatically.

## Database File

- Location: `prisma/dev.db` (created automatically)
- Type: SQLite (single file database)
- No server needed!

## View Database

To view your database in a GUI:
```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

## Reset Database

To reset the database:
```bash
npx prisma db push --force-reset
```

## Notes

- SQLite is perfect for development
- The database is a single file (`dev.db`)
- No PostgreSQL installation needed
- Works on Windows, Mac, and Linux




