import { render, screen, act } from '@testing-library/react';
import Editor from 'components/editor/Editor';
import { store } from 'lib/store';
import { AuthContext } from 'utils/useAuth';
import notes from '__fixtures__/notes';

describe('Editor', () => {
  const renderEditor = () => {
    const auth = {
      isAuthed: false,
      user: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    };
    const firstNote = Object.values(store.getState().notes)[0].content;
    return render(
      <AuthContext.Provider value={auth}>
        <Editor value={firstNote} setValue={jest.fn()} onChange={jest.fn()} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    act(() => {
      store.getState().setNotes(notes);
    });
  });

  it('renders editor and placeholder', () => {
    renderEditor();

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();

    const placeholder = screen.getByText('Start writing here…');
    expect(placeholder).toBeInTheDocument();
  });
});
