-- The Bound · partidas en la nube con código corto (6.22). Ejecutado en Supabase › SQL Editor del proyecto «thebound».
-- La clave pública (publishable/anon) no puede leer ni borrar la tabla: RLS activado y sin políticas. Solo estas dos funciones.
create table if not exists public.cloud_saves (
  code text primary key check (code ~ '^[A-Z2-9]{8}$'),
  secret_hash text not null,
  data text not null check (length(data) <= 3000000),
  game_ver text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.cloud_saves enable row level security;

create extension if not exists pgcrypto with schema extensions;

create or replace function public.tb_save_upload(p_code text, p_secret text, p_data text, p_ver text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare h text := encode(extensions.digest(p_secret, 'sha256'), 'hex'); old text;
begin
  if p_code !~ '^[A-Z2-9]{8}$' or length(p_secret) < 16 or length(p_data) > 3000000 then return 'bad'; end if;
  select secret_hash into old from cloud_saves where code = p_code;
  if old is null then
    insert into cloud_saves(code, secret_hash, data, game_ver) values (p_code, h, p_data, p_ver);
    return 'new';
  end if;
  if old <> h then return 'taken'; end if;
  update cloud_saves set data = p_data, game_ver = p_ver, updated_at = now() where code = p_code;
  return 'ok';
end $$;

create or replace function public.tb_save_download(p_code text)
returns text language sql security definer set search_path = public as $$
  select data from cloud_saves where code = upper(p_code)
$$;

revoke all on function public.tb_save_upload(text,text,text,text) from public;
revoke all on function public.tb_save_download(text) from public;
grant execute on function public.tb_save_upload(text,text,text,text) to anon;
grant execute on function public.tb_save_download(text) to anon;
