import { Link, type LinkProps } from '@tanstack/react-router';
import { forwardRef } from 'react';

const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link {...props} ref={ref} />);

export default RouterLink;
