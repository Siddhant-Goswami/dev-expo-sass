import { useQuery } from '@tanstack/react-query';
import { getOrCreateUserProfile } from './actions';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user_profile'],
    queryFn: () => getOrCreateUserProfile(),
  });
};
