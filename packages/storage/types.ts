type Model = 'gpt-4-turbo' | 'gpt-4o' | 'gpt-3.5-turbo' | 'gpt-4o-mini';

type ChatGPTSlot = {
  type?: Model;
  system?: string;
  /** config */
  maxTokens?: number; // max 4000
  temperature?: number; // 의외성 (0~1)
  topP?: number; // 단어 풀의 범위(0~1)
  frequencyPenalty?: number; // 자주 사용하는 단어 억제
  presencePenalty?: number; // 이미 사용된 단어 억제
};

export type Slot = { id: string; name: string; isSelected: boolean } & ChatGPTSlot;

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
type RequestQuickChatGPT = {
  type: 'RequestQuickChatGPTStream';
  input?: {
    messages: Chat[];
    model: Model;
  };
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
  | RequestQuickChatGPT
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
