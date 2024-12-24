import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/template')({
  component: () => <h2>I am the template page</h2>
});
