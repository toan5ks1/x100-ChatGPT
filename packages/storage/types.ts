// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Slot = { id: string; data: any; isSelected: boolean; expTime?: Date };
export type ActionResult = 'success' | 'failed';

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
type UpdateSlot = {
  type: 'UpdateSlot';
  input: Slot;
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
type AutoSelectSlot = {
  type: 'AutoSelectSlot';
  input?: never;
  data?: ActionResult;
};
type GetSlots = {
  type: 'GetSlots';
  input?: never;
  data?: Slot[];
};
type GetCurrentSlot = {
  type: 'GetCurrentSlot';
  input?: never;
  data?: Slot;
};
export type ErrorMessage = {
  type: 'Error';
  input?: never;
  error: Error;
};

export type Message =
  | AddNewSlot
  | UpdateSlot
  | GetSlots
  | GetCurrentSlot
  | SelectSlot
  | DeleteSlot
  | MessageSent
  | AutoSelectSlot;

export type RequestMessage<M = Message> = Omit<M, 'data'>;
export type ResponseMessage<M = Message> = Omit<M, 'input' | 'error'>;
