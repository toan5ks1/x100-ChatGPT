import { type Slot } from '@extension/storage/types';
import { sendMessageToBackground } from '@extension/storage/lib/service/message';

export const handleUpdateSlot = (slot: Slot, callback?: () => void) => {
  sendMessageToBackground({
    message: {
      input: slot,
      type: 'UpdateSlot',
    },
    handleSuccess: () => {
      callback && callback();
    },
  });
};

export const handleAutoSelectSlot = (callback?: () => void) => {
  sendMessageToBackground({
    message: {
      type: 'AutoSelectSlot',
    },
    handleSuccess: () => {
      callback && callback();
    },
  });
};
