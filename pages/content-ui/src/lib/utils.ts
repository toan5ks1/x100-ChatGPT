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

export const handleUpdateSlotById = (slot: Omit<Slot, 'data'>, callback?: () => void) => {
  sendMessageToBackground({
    message: {
      input: slot,
      type: 'UpdateSlotById',
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
    handleSuccess: data => {
      console.log(data.id);
      callback && callback();
    },
  });
};

export const getShareUrlFromHref = () => {
  const href = window.location.href;

  return href.includes('/share/') && !href.includes('/continue') ? href : null;
};
