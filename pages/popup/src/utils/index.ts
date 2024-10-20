import { sendMessageToBackground } from '@extension/storage/lib/service/message';
import { type RedirectWithId } from '@extension/storage/types';

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

export async function getCurrentURL() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (chrome.runtime.lastError) {
        resolve({}); // Reject the promise if there's an error
      } else {
        resolve({ tabId: tabs[0].id, url: tabs[0].url }); // Resolve the promise with the active tab's URL
      }
    });
  });
}

export const handleSelectSlotRedirect = (input: RedirectWithId, onSuccess?: () => void, onError?: () => void) => {
  sendMessageToBackground({
    message: {
      input,
      type: 'SelectSlotRedirect',
    },
    handleSuccess: () => {
      onSuccess && onSuccess();
    },
    handleError: () => {
      onError && onError();
    },
  });
};

export const handleShareChatRedirect = (
  input: RedirectWithId,
  onSuccess?: (data: string) => void,
  onError?: () => void,
) => {
  sendMessageToBackground({
    message: {
      input: input,
      type: 'ShareChatRedirect',
    },
    handleSuccess: data => {
      onSuccess && onSuccess(data);
    },
    handleError: () => {
      onError && onError();
    },
  });
};
