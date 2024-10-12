import { sendMessageToBackground } from '@extension/storage/lib/service/message';

export const handleDeleteSlot = (id: string) => {
  sendMessageToBackground({
    message: {
      input: id,
      type: 'DeleteSlot',
    },
    handleSuccess: () => {
      alert('Deleted successfully!');
    },
  });
};

export const handleSelectSlot = (id: string, callback?: () => void) => {
  sendMessageToBackground({
    message: {
      input: id,
      type: 'SelectSlot',
    },
    handleSuccess: () => {
      callback && callback();
    },
  });
};
