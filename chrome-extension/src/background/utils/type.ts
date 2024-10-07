import { type Message } from '@extension/storage/types';

export type RequiredDataNullableInput<T extends Message> = {
  type: T['type'];
  input?: unknown;
  data: Exclude<T['data'], undefined>;
};
