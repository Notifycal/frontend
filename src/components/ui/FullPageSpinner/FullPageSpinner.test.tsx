import { render, screen } from '@testing/utils';
import FullPageSpinner from './FullPageSpinner';

describe('FullPageSpinner', () => {
  it('should render the spinner', () => {
    render(<FullPageSpinner />);
    const spinner = screen.getByTestId('full-page-spinner');
    expect(spinner).toBeInTheDocument();
  });
});
