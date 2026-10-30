select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'traveller_profiles';
select policyname, cmd, roles from pg_policies where schemaname = 'public' and tablename = 'traveller_profiles';
