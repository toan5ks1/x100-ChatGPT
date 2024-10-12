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

export function redirectCurrentTab(newUrl: string) {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0]; // Get the active tab

    if (activeTab?.id && newUrl) {
      // Update the current active tab with the new URL
      chrome.tabs.update(activeTab.id, { url: newUrl });
    } else {
      console.error('No active tab found or invalid URL');
    }
  });
}
