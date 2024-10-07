import { sendMessageToBackground, sendMessageToBackgroundAsync } from '@extension/storage/lib/service/message';
import { type Slot } from '@extension/storage/types';

export const getAllSlotsFromBackground = async () => {
  const x = await sendMessageToBackgroundAsync({
    type: 'GetSlots',
  });

  console.log(x);

  return x;
};

export const addSlotMessageSendToBackground = (newSlot: Slot) => {
  sendMessageToBackground({
    message: { type: 'AddNewSlot', input: newSlot },
  });
};

export function createNewChatGPTSlot(config?: Partial<Slot>): Slot {
  return {
    isSelected: false,
    id: generateId(),
    name: '',
    ...config,
  };
}

function generateId(): string {
  return `${Date.now()}${Math.random()}`;
}
