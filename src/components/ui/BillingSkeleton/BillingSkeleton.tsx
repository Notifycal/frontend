import { Card, Skeleton, Divider, Box } from '@mantine/core';
import type { FC } from 'react';

interface BillingSkeletonProps {
  cardCommonProps: {
    withBorder: boolean;
    padding: string;
    radius: string;
    shadow: string;
  };
}

const BillingSkeleton: FC<BillingSkeletonProps> = ({ cardCommonProps }) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card {...cardCommonProps}>
        <Skeleton height={30} mb="md" width="60%" />
        <Skeleton height={20} mb="md" width="80%" />
        <Divider my="md" />
        <Skeleton height={20} mb="md" width="40%" />
        <Box>
          <Skeleton height={15} mb="xs" width="90%" />
          <Skeleton height={15} mb="xs" width="85%" />
          <Skeleton height={15} mb="xs" width="70%" />
        </Box>
        <Divider my="md" />
        <Skeleton height={60} /> {/* Alert */}
      </Card>

      <Card {...cardCommonProps}>
        <Skeleton height={30} mb="md" width="50%" />
        <Skeleton height={20} mb="xs" width="90%" />
        <Skeleton height={50} mb="md" />
        <Divider my="md" />
        <Skeleton height={20} mb="md" width="40%" />
        <Skeleton height={40} width="100%" />
      </Card>

      <Card {...cardCommonProps} className="lg:col-span-2">
        <Skeleton height={30} mb="lg" width="30%" />
        <Box className="flex flex-col gap-5">
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </Box>
      </Card>
    </div>
  );
};

export default BillingSkeleton;
