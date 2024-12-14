-- Create pastes table
create table public.pastes (
  id text primary key,
  content text not null,
  language text not null,
  created_at timestamp with time zone not null,
  expires_at timestamp with time zone not null
);

-- Enable row level security
alter table public.pastes enable row level security;

-- Allow anonymous reads
create policy "Allow anonymous reads"
  on public.pastes
  for select
  to anon
  using (true);

-- Allow anonymous inserts
create policy "Allow anonymous inserts"
  on public.pastes
  for insert
  to anon
  with check (true);
