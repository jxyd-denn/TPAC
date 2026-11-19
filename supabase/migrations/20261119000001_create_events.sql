create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  event_date date not null,
  color text not null default '#26776d',
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Events are viewable by signed-in users"
  on public.events for select
  to authenticated
  using (true);

create policy "Users can create events"
  on public.events for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Event owners can update their events"
  on public.events for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Event owners can delete their events"
  on public.events for delete
  to authenticated
  using ((select auth.uid()) = owner_id);
