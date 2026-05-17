create extension if not exists "pgcrypto";

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  summary text not null,
  key_points jsonb not null default '[]'::jsonb,
  important_concepts jsonb not null default '[]'::jsonb,
  study_tips jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id)
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  question text not null,
  answer text not null,
  difficulty text not null,
  topic text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null,
  difficulty text not null,
  topic text not null,
  created_at timestamptz not null default now()
);

create index if not exists documents_created_at_idx on public.documents(created_at desc);
create index if not exists summaries_document_id_idx on public.summaries(document_id);
create index if not exists flashcards_document_id_idx on public.flashcards(document_id);
create index if not exists quizzes_document_id_idx on public.quizzes(document_id);

alter table public.documents enable row level security;
alter table public.summaries enable row level security;
alter table public.flashcards enable row level security;
alter table public.quizzes enable row level security;

create policy "Allow anonymous document reads" on public.documents for select to anon using (true);
create policy "Allow anonymous document inserts" on public.documents for insert to anon with check (true);

create policy "Allow anonymous summary reads" on public.summaries for select to anon using (true);
create policy "Allow anonymous summary inserts" on public.summaries for insert to anon with check (true);
create policy "Allow anonymous summary updates" on public.summaries for update to anon using (true) with check (true);

create policy "Allow anonymous flashcard reads" on public.flashcards for select to anon using (true);
create policy "Allow anonymous flashcard inserts" on public.flashcards for insert to anon with check (true);
create policy "Allow anonymous flashcard deletes" on public.flashcards for delete to anon using (true);

create policy "Allow anonymous quiz reads" on public.quizzes for select to anon using (true);
create policy "Allow anonymous quiz inserts" on public.quizzes for insert to anon with check (true);
create policy "Allow anonymous quiz deletes" on public.quizzes for delete to anon using (true);
