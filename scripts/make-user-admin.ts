import { ADMIN_ROLES } from '@/app/(admin)/constants';
import { env } from '@/env';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const userId = ''; // Set the userId here...

const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
  role: ADMIN_ROLES._100xAdmin,
});

console.log({ data, error });
