import type { Descendant } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BillingFrequency, PlanId } from 'constants/pricing';
import { NoteTreeItem, WikiTreeItem } from 'lib/store';
import { getDefaultEditorValue } from 'editor/constants';

export enum SubscriptionStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export type User = {
  id: string;
  subscription_id: Subscription['id'] | null;
  note_tree: NoteTreeItem[];
  wiki_tree: WikiTreeItem[] | null;
};

export type Note = {
  id: string;
  title: string;
  content: Descendant[];
  user_id: User['id'] | null;
  md_content: string | null;
  cover: string | null;
  attr: Attr | null;
  created_at: string;
  updated_at: string;
  is_pub: boolean;
  is_wiki: boolean;
  is_daily: boolean;
};

export type Subscription = {
  id: string;
  user_id: User['id'];
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan_id: PlanId;
  subscription_status: SubscriptionStatus;
  frequency: BillingFrequency;
  current_period_end: string;
  cancel_at_period_end: boolean;
};

export type Attr = { -readonly [key in string]-?: string };
// export interface Attr {
//   Type: string;
//   Author: string;
//   Publisher: string;
//   Publish: string;
//   UID: string;
//   Link: string;
// }

export const defaultAttr: Attr = {
  Type: '',
  Author: '',
  Publisher: '',
  Publish: '',
  UID: '',
  Link: '',
};
export const defaultUserId =  '00000000-0000-0000-0000-000000000000';
export const defaultNote =  {
  id: uuidv4(),
  title: 'untitled',
  content: getDefaultEditorValue(),
  user_id: defaultUserId,
  md_content: '',
  cover: '',
  attr: defaultAttr,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_pub: false,
  is_wiki: false,
  is_daily: false,
};

export function buildAttr(k: string, v: string) {
  switch (k) {
    case 'Type':
      return {Type: v};
    case 'Author':
      return {Author: v};
    case 'Publish':
      return {Publish: v};
    case 'Publisher':
      return {Publisher: v};
    case 'UID':
      return {UID: v};
    case 'Link':
      return {Link: v};
    default:
      return {};
  }
}