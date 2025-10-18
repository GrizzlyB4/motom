# Fix for Missing Status Column in Parts Table

## Problem
You're receiving an error indicating that the `status` column is missing in the `parts` table. This can happen when:
1. The database schema hasn't been updated with the latest changes
2. There was an issue during the initial schema application
3. The database was created with an older version of the schema

## Solution
We've created specific SQL scripts to fix this issue:

### Option 1: Specific Fix (Recommended)
Run the `fix_part_status_column.sql` script which specifically addresses the missing status column:

```sql
-- This will ensure the listing_status_enum type exists and the status column is added to the parts table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status_enum') THEN
        CREATE TYPE public.listing_status_enum AS ENUM ('for-sale', 'sold', 'reserved');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parts' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.parts 
        ADD COLUMN status public.listing_status_enum NOT NULL DEFAULT 'for-sale';
    END IF;
END $$;
```

### Option 2: Comprehensive Fix
Run the `comprehensive_fix.sql` script which checks all columns in both motorcycles and parts tables.

## How to Apply the Fix
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the content of `fix_part_status_column.sql` into the editor
4. Run the query

## Verification
After applying the fix, you can verify the column exists by running:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'parts' AND column_name = 'status';
```

This should return one row confirming the status column exists with the correct properties.

## Prevention
To prevent this issue in the future:
1. Always run the complete schema when setting up a new database
2. Apply incremental fixes when updating an existing database
3. Test your database schema after any updates