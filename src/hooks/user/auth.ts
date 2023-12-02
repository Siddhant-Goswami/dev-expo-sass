'use client';
import { env } from '@/env';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from '@tanstack/react-query';

export const supabaseClientComponentClient = () =>
  createClientComponentClient({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

export const useAuth = () => {
  const supabase = supabaseClientComponentClient();
  const userSessionQuery = useQuery({
    queryKey: ['user_session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    isLoaded: !userSessionQuery.isLoading && userSessionQuery.isSuccess,
    session: userSessionQuery.data,
    userId: userSessionQuery.data?.user.id,
    refetch: userSessionQuery.refetch,
  };
};

export const useUser = () => {
  const supabase = supabaseClientComponentClient();
  const userDataQuery = useQuery({
    queryKey: ['user_data'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return data.user;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    user: userDataQuery.data,
    isLoaded: !userDataQuery.isLoading && userDataQuery.isSuccess,
    refetch: userDataQuery.refetch,
  };
};
