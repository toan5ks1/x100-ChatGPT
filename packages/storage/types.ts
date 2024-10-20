// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Slot = { id: string; data: any; expTime?: Date };
export type ActionResult = 'success' | 'failed';

export interface RedirectWithId {
  url: string;
  id: string;
  tabId: number;
}

type AddNewSlot = {
  type: 'AddNewSlot';
  input: Slot;
  data?: ActionResult;
};
type SelectSlot = {
  type: 'SelectSlot';
  input: string;
  data?: ActionResult;
};
type SelectSlotRedirect = {
  type: 'SelectSlotRedirect';
  input: RedirectWithId;
  data?: ActionResult;
};
type ShareChatRedirect = {
  type: 'ShareChatRedirect';
  input: RedirectWithId;
  data?: ActionResult | string;
};
type UpdateSlot = {
  type: 'UpdateSlot';
  input: Slot;
  data?: ActionResult;
};
type UpdateSlotById = {
  type: 'UpdateSlotById';
  input: Omit<Slot, 'data'>;
  data?: ActionResult;
};
type DeleteSlot = {
  type: 'DeleteSlot';
  input: string;
  data?: ActionResult;
};
type MessageSent = {
  type: 'MessageSent';
  input?: never;
  data?: ActionResult;
};
type UrlChanged = {
  type: 'UrlChanged';
  input?: never;
  data?: ActionResult;
};
type AutoSelectSlot = {
  type: 'AutoSelectSlot';
  input?: string;
  data?: Slot;
};
type GetSlots = {
  type: 'GetSlots';
  input?: never;
  data?: Slot[];
};
type GetCurrentSlot = {
  type: 'GetCurrentSlot';
  input?: never;
  data?: Slot['id'];
};
export type ErrorMessage = {
  type: 'Error';
  input?: never;
  error: Error;
};

export type Message =
  | AddNewSlot
  | UpdateSlot
  | UpdateSlotById
  | GetSlots
  | GetCurrentSlot
  | SelectSlot
  | SelectSlotRedirect
  | ShareChatRedirect
  | DeleteSlot
  | MessageSent
  | UrlChanged
  | AutoSelectSlot;

export type RequestMessage<M = Message> = Omit<M, 'data'>;
export type ResponseMessage<M = Message> = Omit<M, 'input' | 'error'>;
