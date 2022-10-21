
export type User = {
  id: string;
};

export type Note = {
  id: string;  // !!Important!! id === file_path
  title: string;
  content: string;
  file_path: string;
  cover: string | null;
  created_at: string;
  updated_at: string;
  is_daily: boolean;
  is_dir?: boolean;
};

export const defaultUserId =  '00000000-0000-0000-0000-000000000000';
export const defaultNote =  {
  title: 'untitled',
  content: ' ',
  file_path: '',
  cover: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_daily: false,
};
