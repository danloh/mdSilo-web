import { render, screen} from '@testing-library/react';
import AppHome from 'pages/app/index';

describe('AppHome', () => {
  it('renders empty text state', () => {
    render(<AppHome />);

    const emptyText = screen.getByText(
      'Get started'
    );
    expect(emptyText).toBeInTheDocument();
  });
});
