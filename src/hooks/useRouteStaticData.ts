import type { StaticDataRoute } from '@router';
import { useMatches } from '@tanstack/react-router';

import { type AllKeyOf, type ExtractFromPaths, extractFromPaths } from '@common/paths';

type StaticDataRouteKeys = AllKeyOf<StaticDataRoute>;

export function useRouteStaticData<T extends ReadonlyArray<StaticDataRouteKeys>>(
  paths: T
): ExtractFromPaths<StaticDataRoute, T> | undefined {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeStaticData = currentRoute?.staticData;

  return routeStaticData ? extractFromPaths(routeStaticData, paths) : undefined;
}
