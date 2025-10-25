-- =================================================================
--
--        SCHEMA SCRIPT PARA LA BASE DE DATOS "MOTOMARKET" (VERSIÓN CORREGIDA Y COMPLETA)
--           Diseñado para ser ejecutado en Supabase
--
-- =================================================================

-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- ===================== 1. TIPOS DE DATOS (ENUMs) =====================
-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- Se eliminan los tipos si ya existen para permitir la re-ejecución del script.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motorcycle_category_enum') THEN DROP TYPE public.motorcycle_category_enum CASCADE; END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'part_category_enum') THEN DROP TYPE public.part_category_enum CASCADE; END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'part_condition_enum') THEN DROP TYPE public.part_condition_enum CASCADE; END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status_enum') THEN DROP TYPE public.offer_status_enum CASCADE; END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status_enum') THEN DROP TYPE public.listing_status_enum CASCADE; END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_type_enum') THEN DROP TYPE public.item_type_enum CASCADE; END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'search_type_enum') THEN DROP TYPE public.search_type_enum CASCADE; END IF;
END$$;

CREATE TYPE public.motorcycle_category_enum AS ENUM ('All', 'Sport', 'Cruiser', 'Off-Road', 'Touring');
CREATE TYPE public.part_category_enum AS ENUM ('All', 'Exhausts', 'Brakes', 'Tires', 'Suspension', 'Electronics');
CREATE TYPE public.part_condition_enum AS ENUM ('new', 'used', 'refurbished');
CREATE TYPE public.offer_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE public.listing_status_enum AS ENUM ('for-sale', 'sold', 'reserved');
CREATE TYPE public.item_type_enum AS ENUM ('motorcycle', 'part');
CREATE TYPE public.search_type_enum AS ENUM ('motorcycle', 'part');

-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- ======================== 2. DEFINICIÓN DE TABLAS ========================
-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

-- Tabla de perfiles públicos de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    profile_image_url text,
    total_rating_points integer NOT NULL DEFAULT 0,
    number_of_ratings integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.profiles IS 'Almacena los perfiles públicos de los usuarios, vinculados a la tabla auth.users.';

-- Tabla para anuncios de motocicletas
CREATE TABLE IF NOT EXISTS public.motorcycles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    make text NOT NULL,
    model text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    year integer NOT NULL,
    mileage integer NOT NULL,
    engine_size integer NOT NULL,
    price numeric NOT NULL,
    image_urls text[] NOT NULL,
    video_url text,
    seller_email text NOT NULL REFERENCES public.profiles(email) ON DELETE CASCADE,
    category public.motorcycle_category_enum NOT NULL CHECK (category <> 'All'),
    status public.listing_status_enum NOT NULL DEFAULT 'for-sale',
    featured boolean NOT NULL DEFAULT false,
    reserved_by text,
    stats jsonb NOT NULL DEFAULT '{ "views": 0, "favorites": 0, "chats": 0 }'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.motorcycles IS 'Anuncios de motocicletas en venta. seller_email está vinculado a un perfil.';

-- Tabla para anuncios de piezas
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
COMMENT ON TABLE public.parts IS 'Anuncios de piezas y repuestos. seller_email está vinculado a un perfil.';

-- Tabla para gestionar ofertas de compra
CREATE TABLE IF NOT EXISTS public.offers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id uuid NOT NULL,
    item_type public.item_type_enum NOT NULL,
    buyer_email text NOT NULL,
    seller_email text NOT NULL,
    offer_amount numeric NOT NULL,
    status public.offer_status_enum NOT NULL DEFAULT 'pending',
    "timestamp" timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.offers IS 'Gestiona las ofertas realizadas por los compradores en los anuncios.';

-- Tabla de unión para motocicletas favoritas
CREATE TABLE IF NOT EXISTS public.motorcycle_favorites (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    motorcycle_id uuid NOT NULL REFERENCES public.motorcycles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, motorcycle_id)
);
COMMENT ON TABLE public.motorcycle_favorites IS 'Tabla de unión para registrar los favoritos de motocicletas por usuario.';

-- Tabla de unión para piezas favoritas
CREATE TABLE IF NOT EXISTS public.part_favorites (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    part_id uuid NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, part_id)
);
COMMENT ON TABLE public.part_favorites IS 'Tabla de unión para registrar los favoritos de piezas por usuario.';

-- Tabla para valoraciones entre usuarios
CREATE TABLE IF NOT EXISTS public.user_ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rater_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    rated_user_email text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (rater_id, rated_user_email)
);
COMMENT ON TABLE public.user_ratings IS 'Almacena las valoraciones que los usuarios se dan entre sí.';

-- Tabla para búsquedas guardadas y alertas
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    search_type public.search_type_enum NOT NULL,
    search_term text,
    location_filter text,
    engine_size_category text,
    price_range jsonb,
    year_range jsonb,
    motorcycle_category public.motorcycle_category_enum,
    part_category public.part_category_enum,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.saved_searches IS 'Permite a los usuarios guardar búsquedas y recibir alertas.';

-- Tabla para datos de mapa de calor
CREATE TABLE IF NOT EXISTS public.heatmap_points (
    id bigserial PRIMARY KEY,
    x integer NOT NULL,
    y integer NOT NULL,
    value integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.heatmap_points IS 'Almacena puntos de datos para visualizaciones de mapa de calor.';

-- Tablas de Chat
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    participants text[] NOT NULL,
    motorcycle_id uuid REFERENCES public.motorcycles(id) ON DELETE SET NULL,
    part_id uuid REFERENCES public.parts(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    archived boolean NOT NULL DEFAULT false,
    archived_at timestamptz
);
COMMENT ON TABLE public.conversations IS 'Representa una conversación de chat entre usuarios sobre un anuncio.';

CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_email text NOT NULL,
    text text NOT NULL,
    is_read boolean NOT NULL DEFAULT false,
    "timestamp" timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.messages IS 'Almacena los mensajes individuales de una conversación.';

-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- =================== 3. AUTOMATIZACIÓN (Funciones y Triggers) ===============
-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

-- Función para crear un perfil de usuario al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.create_user_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función anterior después de un nuevo registro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile_on_signup();
COMMENT ON FUNCTION public.create_user_profile_on_signup IS 'Crea automáticamente un perfil en `profiles` cuando un nuevo usuario se registra.';

-- Función para actualizar la valoración promedio de un vendedor
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    total_rating_points = total_rating_points + NEW.rating,
    number_of_ratings = number_of_ratings + 1
  WHERE email = NEW.rated_user_email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función de valoración después de insertar en user_ratings
DROP TRIGGER IF EXISTS on_new_rating ON public.user_ratings;
CREATE TRIGGER on_new_rating
  AFTER INSERT ON public.user_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_seller_rating();
COMMENT ON FUNCTION public.update_seller_rating IS 'Actualiza la valoración de un usuario cuando se inserta una nueva calificación.';

-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- ================== 4. POLÍTICAS DE SEGURIDAD (RLS) ==================
-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

-- --- Habilitación de RLS en todas las tablas ---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motorcycle_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmap_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- --- Políticas para la tabla 'profiles' ---
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- --- Políticas para 'motorcycles' ---
DROP POLICY IF EXISTS "Motorcycle listings are viewable by everyone." ON public.motorcycles;
CREATE POLICY "Motorcycle listings are viewable by everyone." ON public.motorcycles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create motorcycle listings." ON public.motorcycles;
CREATE POLICY "Authenticated users can create motorcycle listings." ON public.motorcycles FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.email() = seller_email);

DROP POLICY IF EXISTS "Sellers can update their own motorcycle listings." ON public.motorcycles;
CREATE POLICY "Sellers can update their own motorcycle listings." ON public.motorcycles FOR UPDATE USING (auth.email() = seller_email) WITH CHECK (auth.email() = seller_email);

DROP POLICY IF EXISTS "Sellers can delete their own motorcycle listings." ON public.motorcycles;
CREATE POLICY "Sellers can delete their own motorcycle listings." ON public.motorcycles FOR DELETE USING (auth.email() = seller_email);

-- --- Políticas para 'parts' ---
DROP POLICY IF EXISTS "Part listings are viewable by everyone." ON public.parts;
CREATE POLICY "Part listings are viewable by everyone." ON public.parts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create part listings." ON public.parts;
CREATE POLICY "Authenticated users can create part listings." ON public.parts FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.email() = seller_email);

DROP POLICY IF EXISTS "Sellers can update their own part listings." ON public.parts;
CREATE POLICY "Sellers can update their own part listings." ON public.parts FOR UPDATE USING (auth.email() = seller_email) WITH CHECK (auth.email() = seller_email);

DROP POLICY IF EXISTS "Sellers can delete their own part listings." ON public.parts;
CREATE POLICY "Sellers can delete their own part listings." ON public.parts FOR DELETE USING (auth.email() = seller_email);

-- --- Políticas para tablas de favoritos ---
DROP POLICY IF EXISTS "Users can manage their own motorcycle favorites." ON public.motorcycle_favorites;
CREATE POLICY "Users can manage their own motorcycle favorites." ON public.motorcycle_favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own part favorites." ON public.part_favorites;
CREATE POLICY "Users can manage their own part favorites." ON public.part_favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- --- Políticas para la tabla 'offers' ---
DROP POLICY IF EXISTS "Buyer and seller can view their offers." ON public.offers;
CREATE POLICY "Buyer and seller can view their offers." ON public.offers FOR SELECT USING (auth.email() = buyer_email OR auth.email() = seller_email);

DROP POLICY IF EXISTS "Authenticated users can make offers." ON public.offers;
CREATE POLICY "Authenticated users can make offers." ON public.offers FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.email() = buyer_email);

DROP POLICY IF EXISTS "Sellers can update the status of offers on their items." ON public.offers;
CREATE POLICY "Sellers can update the status of offers on their items." ON public.offers FOR UPDATE USING (auth.email() = seller_email) WITH CHECK (auth.email() = seller_email);

-- --- Políticas para la tabla 'user_ratings' ---
DROP POLICY IF EXISTS "Ratings are public." ON public.user_ratings;
CREATE POLICY "Ratings are public." ON public.user_ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can rate other users." ON public.user_ratings;
CREATE POLICY "Authenticated users can rate other users." ON public.user_ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.email() != rated_user_email);

-- --- Políticas para 'saved_searches' ---
DROP POLICY IF EXISTS "Users can manage their own saved searches." ON public.saved_searches;
CREATE POLICY "Users can manage their own saved searches." ON public.saved_searches FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- --- Políticas para 'heatmap_points' (acceso público) ---
DROP POLICY IF EXISTS "Heatmap data is public." ON public.heatmap_points;
CREATE POLICY "Heatmap data is public." ON public.heatmap_points FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert heatmap data." ON public.heatmap_points;
CREATE POLICY "Anyone can insert heatmap data." ON public.heatmap_points FOR INSERT WITH CHECK (true);

-- --- Políticas para 'conversations' y 'messages' ---
DROP POLICY IF EXISTS "Participants can access their conversations." ON public.conversations;
CREATE POLICY "Participants can access their conversations." ON public.conversations FOR ALL USING (auth.email() = ANY(participants)) WITH CHECK (auth.email() = ANY(participants));

DROP POLICY IF EXISTS "Participants can access messages in their conversations." ON public.messages;
CREATE POLICY "Participants can access messages in their conversations." ON public.messages FOR ALL USING ((
  SELECT true
  FROM public.conversations
  WHERE id = conversation_id AND auth.email() = ANY(participants)
)) WITH CHECK ((
  SELECT true
  FROM public.conversations
  WHERE id = conversation_id AND auth.email() = ANY(participants)
));

-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- ============================ 5. ÍNDICES =============================
-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
-- Crear índices para mejorar el rendimiento de las consultas frecuentes.

CREATE INDEX IF NOT EXISTS idx_motorcycles_seller_email ON public.motorcycles (seller_email);
CREATE INDEX IF NOT EXISTS idx_parts_seller_email ON public.parts (seller_email);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_email ON public.offers (buyer_email);
CREATE INDEX IF NOT EXISTS idx_offers_seller_email ON public.offers (seller_email);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rated_user_email ON public.user_ratings (rated_user_email);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON public.saved_searches (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN (participants);

-- =================================================================
--                     FIN DEL SCRIPT DE SCHEMA
-- =================================================================
