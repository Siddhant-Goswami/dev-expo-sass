import { env } from '@/env';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

await supabaseAdmin.auth.admin.deleteUser(
  '1ed689a6-e359-4c1f-821d-8c67d56c586f',
);
