export type ValueOf<T> = T[keyof T];

export interface ShareChat {
  shareId?: string;
  shareUrl?: string;
}
