import { render, screen } from '@testing/utils';
import FullPageOverlaySpinner from './FullPageOverlaySpinner';

describe('FullPageOverlaySpinner', () => {
  it('should render the spinner', () => {
    render(<FullPageOverlaySpinner />);
    const spinner = screen.getByTestId('full-page-spinner');
    expect(spinner).toBeInTheDocument();
  });
});
