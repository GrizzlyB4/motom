-- Fix for the missing status column in the parts table
-- This script ensures the status column exists in the parts table with the correct type and constraints

-- First, check if the listing_status_enum type exists, create it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status_enum') THEN
        CREATE TYPE public.listing_status_enum AS ENUM ('for-sale', 'sold', 'reserved');
    END IF;
END $$;

-- Check if the status column exists in the parts table
DO $$ 
BEGIN
    -- If the column doesn't exist, add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parts' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.parts 
        ADD COLUMN status public.listing_status_enum NOT NULL DEFAULT 'for-sale';
    END IF;
    
    -- If the column exists but might have wrong constraints, ensure it's correct
    -- This would be needed if there was a previous incorrect migration
END $$;

-- Also ensure the motorcycles table has the status column (for completeness)
DO $$ 
BEGIN
    -- If the column doesn't exist, add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'motorcycles' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.motorcycles 
        ADD COLUMN status public.listing_status_enum NOT NULL DEFAULT 'for-sale';
    END IF;
END $$;