import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/template')({
  component: () => <h2>I am the template page</h2>
});
