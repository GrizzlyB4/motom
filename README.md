# MotoMarket - Motorcycle Marketplace

A full-stack web application for buying and selling motorcycles and parts, with AI-powered features via the Gemini API.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. Set up your Supabase project:
   - Create a new Supabase project
   - Run the schema.sql script in your Supabase SQL editor
   - Add your Supabase credentials to `.env.local`:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Could not find the 'condition' column of 'parts' in the schema cache"

This error typically occurs when there's a mismatch between the database schema and what the application expects. To resolve this issue:

1. First, verify that the `parts` table has the `condition` column:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'parts' AND column_name = 'condition';
   ```
   This query should return one row if the column exists.

2. If the column doesn't exist, you need to add it to your database:
   ```sql
   ALTER TABLE public.parts 
   ADD COLUMN condition public.part_condition_enum NOT NULL;
   ```

3. If the column exists but you're still getting the error, refresh the Supabase schema cache:
   - Go to your Supabase project dashboard
   - Navigate to "Database" → "Replication"
   - Click "Reset" to refresh the schema cache

4. As a last resort, you can recreate the parts table:
   - Backup your data first
   - Drop the existing parts table:
     ```sql
     DROP TABLE IF EXISTS public.parts CASCADE;
     ```
   - Recreate it using the schema from schema.sql:
     ```sql
     CREATE TABLE IF NOT EXISTS public.parts (
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         name text NOT NULL,
         description text NOT NULL,
         location text NOT NULL,
         price numeric NOT NULL,
         image_urls text[] NOT NULL,
         video_url text,
         seller_email text NOT NULL REFERENCES public.profiles(email) ON DELETE CASCADE,
         category public.part_category_enum NOT NULL CHECK (category <> 'All'),
         condition public.part_condition_enum NOT NULL,
         compatibility text[] NOT NULL,
         status public.listing_status_enum NOT NULL DEFAULT 'for-sale',
         featured boolean NOT NULL DEFAULT false,
         reserved_by text,
         stats jsonb NOT NULL DEFAULT '{ "views": 0, "favorites": 0, "chats": 0 }'::jsonb,
         created_at timestamptz NOT NULL DEFAULT now()
     );
     ```

### npm Optional Dependencies Issue (Rollup modules)

You might encounter an error related to missing Rollup modules, which is a known npm issue with optional dependencies. Here are several solutions to try:

#### Solution 1: Clean Installation (Recommended)
As the error message suggests, try removing the package-lock.json and node_modules directory, then reinstall:
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Solution 2: Install Missing Dependency Directly
If the clean installation doesn't work, try installing the missing module directly:
```bash
npm install @rollup/rollup-linux-x64-gnu --save-dev
```

#### Solution 3: Rebuild Node Modules
Sometimes rebuilding the modules can help:
```bash
npm rebuild
```

#### Solution 4: Use Alternative Package Manager
If you continue having issues with npm, try using Yarn or pnpm instead:
```bash
# Using Yarn
yarn install
yarn build

# Or using pnpm
pnpm install
pnpm build
```

#### Solution 5: Platform-Specific Fix
Since this is a platform-specific module issue, you might need to install the appropriate version for your system:
```bash
# For Windows
npm install @rollup/rollup-win32-x64-msvc --save-dev

# For macOS
npm install @rollup/rollup-darwin-x64 --save-dev
```

#### Solution 6: Update Node.js and npm
Make sure you're using compatible versions:
```bash
# Check versions
node --version
npm --version

# Update npm
npm install -g npm@latest
```

#### For Vercel Deployment
If you're seeing this error during Vercel deployment, you can try adding this to your package.json:
```json
{
  "engines": {
    "node": "20.x"
  }
}
```

Or add a .nvmrc file to your project root:
```
20
```

This will ensure Vercel uses Node.js version 20 instead of 22, which might have better compatibility with the current dependencies.

Try these solutions in order, and the clean installation (Solution 1) should resolve the issue in most cases. This is a known npm bug related to optional dependencies and not an issue with your application code.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Technologies Used

- React v19.2.0
- TypeScript ~5.8.2
- Vite v6.2.0
- Tailwind CSS ^4.1.14
- Supabase.js SDK ^2.75.1
- Google GenAI SDK ^1.24.0