import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@api/userProfile';
import type { JSX } from 'react';
import { isObject } from 'radashi';

type DisplayProps = {
  data: unknown;
  depth?: number;
};

function KeyValueRecursive({ data, depth = 0 }: DisplayProps): JSX.Element {
  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: depth * 16 }}>
        {data.map((item, index) => (
          <div key={index}>
            <strong>[{index}]:</strong> <KeyValueRecursive data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (isObject(data)) {
    return (
      <div style={{ marginLeft: depth * 16 }}>
        {Object.entries(data).map(([key, value]: [string, unknown]) => (
          <div key={key} className="mb-1">
            <strong>{key}:</strong> <KeyValueRecursive data={value} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

const Dashboard = (): JSX.Element => {
  const query = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  return <div>{!!query.data && <KeyValueRecursive data={query.data} />}</div>;
};

export default Dashboard;
