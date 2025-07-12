import BillingInfoCard from "@components/ui/BillingInfoCard/BillingInfoCard";
import TopUpCard from "@components/ui/TopUpCard/TopUpCard";
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userProfile';
import type { JSX } from "react";

const Billing = (): JSX.Element => {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <BillingInfoCard isLoadingUser={isLoadingUser} user={user} />
      <TopUpCard isLoadingUser={isLoadingUser} user={user} />
    </div>
  );
};

export default Billing;
