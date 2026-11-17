-- مخطط قاعدة بيانات اختياري (Supabase / PostgreSQL) — نفس هيكل الموقع الحالي.
-- الموقع دلوقتي بيشتغل بدون قاعدة بيانات (متصفح + Excel). الملف ده للمرحلة الجاية لو عايز بيانات مشتركة بين الأجهزة.
create table if not exists groups (code text primary key, title text not null);           -- f = البنات ، m = الشباب
insert into groups values ('f','البنات'),('m','الشباب') on conflict do nothing;

create table if not exists shifts (                                                       -- الورديات
  id bigint generated always as identity primary key,
  grp text not null references groups(code),
  work_date date, factory text not null, worker text not null,
  hours numeric not null default 8, cost numeric not null default 0, bill numeric not null default 0,
  created_by text, created_at timestamptz default now());
create table if not exists payments (                                                     -- المدفوعات (اللي خده العامل)
  id bigint generated always as identity primary key,
  grp text not null references groups(code),
  pay_date date, worker text not null, amount numeric not null, kind text default 'سلف', note text,
  created_by text, created_at timestamptz default now());
create table if not exists collections (                                                  -- المتحصلات من المصانع
  id bigint generated always as identity primary key,
  grp text not null references groups(code),
  col_date date, factory text not null, amount numeric not null, note text,
  created_by text, created_at timestamptz default now());
create table if not exists expenses (                                                     -- مصروفات أخرى
  id bigint generated always as identity primary key,
  grp text not null references groups(code),
  exp_date date, item text, note text, amount numeric not null,
  created_by text, created_at timestamptz default now());

-- رصيد كل فرد: المستحق - المدفوع (موجب = للعامل عند الشركة ، سالب = سلف زيادة)
create or replace view worker_balance as
select s.grp, s.worker, sum(s.cost) as due, coalesce(p.paid,0) as paid, sum(s.cost)-coalesce(p.paid,0) as remaining
from shifts s left join (select grp, worker, sum(amount) paid from payments group by 1,2) p using (grp, worker)
group by s.grp, s.worker, p.paid;
-- موقف كل مصنع: المستحق عليه - المحصّل
create or replace view factory_balance as
select s.grp, s.factory, sum(s.bill) as billed, coalesce(c.col,0) as collected, sum(s.bill)-coalesce(c.col,0) as remaining
from shifts s left join (select grp, factory, sum(amount) col from collections group by 1,2) c using (grp, factory)
group by s.grp, s.factory, c.col;
-- مهم: فعّل Row Level Security وأضف سياسات الدخول قبل ما تربط الموقع بالقاعدة.
