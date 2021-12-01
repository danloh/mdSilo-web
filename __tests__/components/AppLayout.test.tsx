import { render, screen, act } from '@testing-library/react';
import AppLayout from 'components/AppLayout';
import { store } from 'lib/store';
import apiClient from 'lib/apiClient';
import { AuthContext } from 'utils/useAuth';
import notes from '__fixtures__/notes';


// TODO: test in offline mode

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, pathname: '/app' }),
}));

describe('AppLayout', () => {
  const renderAppLayout = () => {
    const auth = {
      isAuthed: true,
      user: {
        id: '1',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: new Date().toISOString(),
      },
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

  it('renders children', async () => {
    renderAppLayout();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(apiClient.from).toHaveBeenCalledWith('notes');

    expect(await screen.findByText('Test')).toBeInTheDocument();
  });
});
