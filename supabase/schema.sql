create table public.habit_logs (
  created_at timestamp with time zone not null default now(),
  habit_id uuid null,
  date date null default now(),
  status text null default ''::text,
  id uuid not null,
  user_id uuid not null,
  constraint habit_logs_pkey primary key (id),
  constraint habit_logs_habit_id_fkey foreign KEY (habit_id) references habits (id) on delete CASCADE,
  constraint habit_logs_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;

create table public.habit_logs (
  created_at timestamp with time zone not null default now(),
  habit_id uuid null,
  date date null default now(),
  status text null default ''::text,
  id uuid not null,
  user_id uuid not null,
  constraint habit_logs_pkey primary key (id),
  constraint habit_logs_habit_id_fkey foreign KEY (habit_id) references habits (id) on delete CASCADE,
  constraint habit_logs_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;