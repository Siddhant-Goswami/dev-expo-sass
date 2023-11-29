import { useQuery } from '@tanstack/react-query';
import { getOrCreateUserProfile } from './actions';
import { useAuth } from './auth';

export const useUserProfile = () => {
  const { session, isLoaded } = useAuth();
  return useQuery({
    queryKey: ['user_profile'],
    queryFn: () => getOrCreateUserProfile(),

    // Only run this query when the user is logged in
    enabled: isLoaded && Boolean(session?.user.id),
  });
};
