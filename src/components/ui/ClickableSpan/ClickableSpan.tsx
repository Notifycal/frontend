import { Loader, type LoaderProps } from '@mantine/core';
import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';

interface ClickableSpanProps extends PropsWithChildren {
  onClick: () => void;
  isPending: boolean;
  loaderProps?: LoaderProps;
}

const ClickableSpan: FC<ClickableSpanProps> = ({ children, onClick, isPending, loaderProps }) => (
  <span className="inline-flex items-center gap-1">
    <span
      className={clsx(
        'underline',
        isPending ? 'text-primary-900 cursor-not-allowed' : 'text-primary-700 cursor-pointer'
      )}
      onClick={isPending ? (): void => {} : onClick}
    >
      {children}
    </span>
    {isPending && <Loader {...loaderProps} />}
  </span>
);

export default ClickableSpan;
