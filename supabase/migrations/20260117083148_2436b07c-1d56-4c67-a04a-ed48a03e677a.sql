CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for scrim status
CREATE TYPE public.scrim_status AS ENUM ('upcoming', 'live', 'completed', 'cancelled');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for stream type
CREATE TYPE public.stream_type AS ENUM ('direct', 'third_party');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    username TEXT NOT NULL,
    avatar_url TEXT,
    discord_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

-- Create scrims table
CREATE TABLE public.scrims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    game TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0,
    max_players INTEGER NOT NULL DEFAULT 10,
    status scrim_status NOT NULL DEFAULT 'upcoming',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scrim_applications table
CREATE TABLE public.scrim_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scrim_id UUID REFERENCES public.scrims(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    status application_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (scrim_id, user_id)
);

-- Create streams table
CREATE TABLE public.streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    stream_type stream_type NOT NULL DEFAULT 'third_party',
    embed_url TEXT,
    direct_stream_key TEXT,
    scrim_id UUID REFERENCES public.scrims(id) ON DELETE SET NULL,
    is_live BOOLEAN NOT NULL DEFAULT false,
    thumbnail_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrim_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "User roles are viewable by authenticated users"
ON public.user_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Scrims policies
CREATE POLICY "Scrims are viewable by everyone"
ON public.scrims FOR SELECT
USING (true);

CREATE POLICY "Admins can manage scrims"
ON public.scrims FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Scrim applications policies
CREATE POLICY "Users can view their own applications"
ON public.scrim_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own applications"
ON public.scrim_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending applications"
ON public.scrim_applications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
ON public.scrim_applications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Streams policies
CREATE POLICY "Streams are viewable by everyone"
ON public.streams FOR SELECT
USING (true);

CREATE POLICY "Admins can manage streams"
ON public.streams FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scrims_updated_at
BEFORE UPDATE ON public.scrims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scrim_applications_updated_at
BEFORE UPDATE ON public.scrim_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streams_updated_at
BEFORE UPDATE ON public.streams
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email));
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();