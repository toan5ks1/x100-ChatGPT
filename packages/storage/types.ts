// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Slot = { id: number; data: any; isSelected: boolean };

type Chat = {
  role: 'user' | 'assistant' | 'error';
  content: string;
};

type AddNewSlot = {
  type: 'AddNewSlot';
  input: Slot;
  data?: 'success';
};
type SelectSlot = {
  type: 'SelectSlot';
  input: number;
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
type RequestOnetimeChatGPT = {
  type: 'RequestOnetimeChatGPT';
  input: string;
  data?: { result: string };
};
type RequestGenerateChatGPTPrompt = {
  type: 'RequestGenerateChatGPTPrompt';
  input: string;
  data?: { result: string };
};
type RequestOngoingChatGPT = {
  type: 'RequestOngoingChatGPT';
  input: Chat[];
  data?: { result: string };
};
type RequestInitialDragGPT = {
  type: 'RequestInitialDragGPTStream';
  input?: string;
  data?: { result: string; chunk?: string; isDone?: boolean };
};
type RequestDragGPT = {
  type: 'RequestDragGPTStream';
  input?: { chats: Chat[]; sessionId: string };
  data?: { result: string; chunk?: string; isDone?: boolean };
};
type SaveAPIKey = {
  type: 'SaveAPIKey';
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
type GetQuickChatHistory = {
  type: 'GetQuickChatHistory';
  input?: never;
  data?: Chat[];
};
type ResetQuickChatHistory = {
  type: 'ResetQuickChatHistory';
  input?: never;
  data?: 'success';
};
type PushChatHistory = {
  type: 'PushChatHistory';
  input: { chats: Chat | Chat[]; sessionId: string };
  data?: 'success';
};
type SaveChatHistory = {
  type: 'SaveChatHistory';
  input: { chats: Chat[]; sessionId: string; type: 'Quick' | 'Drag' };
  data?: 'success';
};
type DeleteAllChatHistory = {
  type: 'DeleteAllChatHistory';
  input?: never;
  data?: 'success';
};
type DeleteChatHistorySession = {
  type: 'DeleteChatHistorySession';
  input: string;
  data?: 'success';
};
export type ErrorMessage = {
  type: 'Error';
  input?: never;
  error: Error;
};

export type Message =
  | RequestInitialDragGPT
  | RequestDragGPT
  | RequestOngoingChatGPT
  | ResetQuickChatHistory
  | SaveChatHistory
  | PushChatHistory
  | DeleteAllChatHistory
  | DeleteChatHistorySession
  | GetQuickChatHistory
  | AddNewSlot
  | UpdateSlot
  | GetSlots
  | GetAPIKey
  | ResetAPIKey
  | SelectSlot
  | DeleteSlot
  | RequestOnetimeChatGPT
  | RequestGenerateChatGPTPrompt
  | SaveAPIKey;

export type RequestMessage<M = Message> = Omit<M, 'data'>;
export type ResponseMessage<M = Message> = Omit<M, 'input' | 'error'>;
