import { env } from '@/env';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from '@tanstack/react-query';

export const supabaseClientComponentClient = () =>
  createClientComponentClient({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

export const useUserSession = () => {
  const userSessionQuery = useQuery({
    queryKey: ['user_session'],
    queryFn: async () => {
      const supabase = supabaseClientComponentClient();

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
    session: userSessionQuery.data,
    isLoading: userSessionQuery.isLoading,
    isError: userSessionQuery.isError,
    error: userSessionQuery.error,
    refetch: userSessionQuery.refetch,
  };
};
export const useUserData = () => {
  const userDataQuery = useQuery({
    queryKey: ['user_data'],
    queryFn: async () => {
      const supabase = supabaseClientComponentClient();

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
    isLoading: userDataQuery.isLoading,
    isError: userDataQuery.isError,
    error: userDataQuery.error,
    refetch: userDataQuery.refetch,
  };
};
