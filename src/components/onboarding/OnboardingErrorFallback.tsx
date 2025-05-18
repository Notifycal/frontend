import FlatError from '@components/ui/FlatError/FlatError';

const OnboardingErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => {
  return <FlatError onErrorClose={resetErrorBoundary}>{error.message}</FlatError>;
};

export default OnboardingErrorFallback;
