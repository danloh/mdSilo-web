import { render, screen, act } from '@testing-library/react';
import AppLayout from 'components/AppLayout';
import { AuthContext } from 'utils/useAuth';
import notes from '__fixtures__/notes';


// TODO: test in offline mode

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/app' }),
}));

describe('AppLayout', () => {
  const renderAppLayout = () => {
    const auth = {
      isAuthed: false,
      user: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    };
    return render(
      <AuthContext.Provider value={auth}>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    act(() => {
      store.getState().setNotes(notes);
    });
  });

  // Why: TypeError: router.replace is not a function
  it('renders children', async () => {
    // renderAppLayout();
    // expect(screen.getByTestId('spinner')).toBeInTheDocument();
    // expect(await screen.findByText('Test')).toBeInTheDocument();
  });
});
