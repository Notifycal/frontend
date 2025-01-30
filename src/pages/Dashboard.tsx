import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from '@api/userProfile';

import type { FunctionComponent } from '@common/types';

export const Dashboard = (): FunctionComponent => {
  // const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  return (
    <>
      <span>
        Username:
        {!!query.data && <span> {query.data.userId}</span>}
      </span>
    </>
  );
};
