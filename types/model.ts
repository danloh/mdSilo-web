
export type User = {
  id: string;
};

export type Note = {
  id: string;
  title?: string;
  content: string;
  user_id: User['id'] | null;
  created_at: string;
  updated_at: string;
  is_pub: boolean;
  is_wiki: boolean;
  is_daily: boolean;
};

export const defaultUserId =  '00000000-0000-0000-0000-000000000000';
export const defaultNote =  {
  content: '',
  user_id: defaultUserId,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_pub: false,
  is_wiki: false,
  is_daily: false,
};
