import { createFileRoute } from '@tanstack/react-router';

import { Feedback } from '@pages/Feedback';

export const Route = createFileRoute('/_auth/_app/feedback')({
  component: Feedback
});
