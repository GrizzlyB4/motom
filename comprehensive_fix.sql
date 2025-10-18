-- Comprehensive fix for column mapping issues between TypeScript and Database

-- Ensure all required types exist
DO $$ 
BEGIN
    -- Motorcycle category enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motorcycle_category_enum') THEN
        CREATE TYPE public.motorcycle_category_enum AS ENUM ('All', 'Sport', 'Cruiser', 'Off-Road', 'Touring');
    END IF;
    
    -- Part category enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'part_category_enum') THEN
        CREATE TYPE public.part_category_enum AS ENUM ('All', 'Exhausts', 'Brakes', 'Tires', 'Suspension', 'Electronics');
    END IF;
    
    -- Part condition enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'part_condition_enum') THEN
        CREATE TYPE public.part_condition_enum AS ENUM ('new', 'used', 'refurbished');
    END IF;
    
    -- Offer status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status_enum') THEN
        CREATE TYPE public.offer_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
    END IF;
    
    -- Listing status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status_enum') THEN
        CREATE TYPE public.listing_status_enum AS ENUM ('for-sale', 'sold', 'reserved');
    END IF;
    
    -- Item type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_type_enum') THEN
        CREATE TYPE public.item_type_enum AS ENUM ('motorcycle', 'part');
    END IF;
    
    -- Search type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'search_type_enum') THEN
        CREATE TYPE public.search_type_enum AS ENUM ('motorcycle', 'part');
    END IF;
END $$;

-- Ensure motorcycles table has all required columns with correct names and types
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'category') THEN
        ALTER TABLE public.motorcycles ADD COLUMN category public.motorcycle_category_enum NOT NULL DEFAULT 'Sport' CHECK (category <> 'All');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'make') THEN
        ALTER TABLE public.motorcycles ADD COLUMN make text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'model') THEN
        ALTER TABLE public.motorcycles ADD COLUMN model text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'year') THEN
        ALTER TABLE public.motorcycles ADD COLUMN year integer NOT NULL DEFAULT 2020;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'mileage') THEN
        ALTER TABLE public.motorcycles ADD COLUMN mileage integer NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'engine_size') THEN
        ALTER TABLE public.motorcycles ADD COLUMN engine_size integer NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'price') THEN
        ALTER TABLE public.motorcycles ADD COLUMN price numeric NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'image_urls') THEN
        ALTER TABLE public.motorcycles ADD COLUMN image_urls text[] NOT NULL DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'video_url') THEN
        ALTER TABLE public.motorcycles ADD COLUMN video_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'seller_email') THEN
        ALTER TABLE public.motorcycles ADD COLUMN seller_email text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'status') THEN
        ALTER TABLE public.motorcycles ADD COLUMN status public.listing_status_enum NOT NULL DEFAULT 'for-sale';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'featured') THEN
        ALTER TABLE public.motorcycles ADD COLUMN featured boolean NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'reserved_by') THEN
        ALTER TABLE public.motorcycles ADD COLUMN reserved_by text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'stats') THEN
        ALTER TABLE public.motorcycles ADD COLUMN stats jsonb NOT NULL DEFAULT '{ "views": 0, "favorites": 0, "chats": 0 }'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'motorcycles' AND column_name = 'created_at') THEN
        ALTER TABLE public.motorcycles ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;
END $$;

-- Ensure parts table has all required columns with correct names and types
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'parts' AND column_name = 'category') THEN
        ALTER TABLE public.parts ADD COLUMN category public.part_category_enum NOT NULL DEFAULT 'Exhausts' CHECK (category <> 'All');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'parts' AND column_name = 'name') THEN
        ALTER TABLE public.parts ADD COLUMN name text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'parts' AND column_name = 'condition') THEN
        ALTER TABLE public.parts ADD COLUMN condition public.part_condition_enum NOT NULL DEFAULT 'new';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'parts' AND column_name = 'compatibility') THEN
        ALTER TABLE public.parts ADD COLUMN compatibility text[] NOT NULL DEFAULT '{}';
    END IF;
    
    -- Other columns are already checked in the motorcycles section
END $$;

-- Refresh the Supabase schema cache
-- Note: This is typically done automatically, but you might need to restart your Supabase client