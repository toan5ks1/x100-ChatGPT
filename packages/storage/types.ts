// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Slot = { id: string; data: any; isSelected: boolean };

type AddNewSlot = {
  type: 'AddNewSlot';
  input: Slot;
  data?: 'success';
};
type SelectSlot = {
  type: 'SelectSlot';
  input: string;
  data?: 'success';
};
type UpdateSlot = {
  type: 'UpdateSlot';
  input: Slot;
  data?: 'success';
};
type DeleteSlot = {
  type: 'DeleteSlot';
  input: string;
  data?: 'success';
};
type ResetAPIKey = {
  type: 'ResetAPIKey';
  input?: never;
  data?: 'success';
};
type GetAPIKey = {
  type: 'GetAPIKey';
  input?: never;
  data?: string;
};
type GetSlots = {
  type: 'GetSlots';
  input?: never;
  data?: Slot[];
};
export type ErrorMessage = {
  type: 'Error';
  input?: never;
  error: Error;
};

export type Message = AddNewSlot | UpdateSlot | GetSlots | GetAPIKey | ResetAPIKey | SelectSlot | DeleteSlot;

export type RequestMessage<M = Message> = Omit<M, 'data'>;
export type ResponseMessage<M = Message> = Omit<M, 'input' | 'error'>;
