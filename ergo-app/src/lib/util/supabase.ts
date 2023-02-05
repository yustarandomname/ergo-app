import { createClient } from '@supabase/supabase-js';
import { PUBLIC_API_URL, PUBLIC_ANON_KEY } from '$env/static/public';

import type { Database } from '$lib/database.types';

export const supabase = createClient<Database>(PUBLIC_API_URL, PUBLIC_ANON_KEY);
