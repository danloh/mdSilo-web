-- extensions

DROP EXTENSION IF EXISTS citext CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION IF NOT EXISTS citext with SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" with SCHEMA public;

-- public.notes definition

DROP TABLE IF EXISTS public.notes;
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title citext NOT NULL,
  content jsonb NOT NULL DEFAULT (('[ { "id": "'::text || uuid_generate_v4()) || '", "type": "paragraph", "children": [{ "text": "" }] } ]'::text)::jsonb,
  user_id uuid NULL,
  md_content text NULL,
  cover text NULL, -- todo
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_pub BOOLEAN NOT NULL DEFAULT FALSE, 
  is_wiki BOOLEAN NOT NULL DEFAULT FALSE,
  is_daily BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT non_empty_title CHECK ((title <> ''::citext)),
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_user_id_title_key UNIQUE (user_id, title)
);

-- public.users definition

DROP TABLE IF EXISTS public.users;
CREATE TABLE public.users (
  id uuid NOT NULL,
  note_tree jsonb NULL,
  wiki_tree jsonb NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- public.notes foreign keys

ALTER TABLE public.notes ADD CONSTRAINT note_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- public.users foreign keys

ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);

-- set timestamp trigger

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS trigger 
  language plpgsql 
  security definer 
  set search_path = public
  as $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
  $$;

drop trigger if exists set_timestamp on public.notes;
create trigger set_timestamp
  before update on public.notes
  for each row execute function trigger_set_timestamp();


-- handle new user trigger

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger 
  language plpgsql 
  security definer 
  set search_path = public
  as $$
    begin
      insert into public.users (id)
      values (new.id);
      return new;
    end;
  $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
