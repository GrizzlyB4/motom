-- Script to fix the category column issue in the motorcycles table

-- First, check if the category column exists
DO $$ 
BEGIN
    -- If the column doesn't exist, add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'motorcycles' AND column_name = 'category'
    ) THEN
        ALTER TABLE public.motorcycles 
        ADD COLUMN category public.motorcycle_category_enum NOT NULL DEFAULT 'Sport' CHECK (category <> 'All');
    END IF;
    
    -- Ensure the enum type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motorcycle_category_enum') THEN
        CREATE TYPE public.motorcycle_category_enum AS ENUM ('All', 'Sport', 'Cruiser', 'Off-Road', 'Touring');
    END IF;
    
    -- If the column exists but might have wrong constraints, drop and recreate it
    -- This is a more aggressive approach, but only do this if the above doesn't work
    -- ALTER TABLE public.motorcycles DROP COLUMN IF EXISTS category;
    -- ALTER TABLE public.motorcycles ADD COLUMN category public.motorcycle_category_enum NOT NULL CHECK (category <> 'All');
END $$;