import { useQuery } from '@tanstack/react-query';
import { getAllAccessories } from 'services/accessory';

export const useGetAccessories = () => {
  return useQuery({
    queryKey: ['accessories'],
    queryFn: getAllAccessories,
    staleTime: 1000 * 60 * 5, // optional: cache data for 5 minutes
  });
};
