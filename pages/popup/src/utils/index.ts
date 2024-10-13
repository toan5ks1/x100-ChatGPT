import { sendMessageToBackground } from '@extension/storage/lib/service/message';
import { tokenStorage } from '@extension/storage';

import {
  getConversationIdByURL,
  createHeader,
  getCurrentNodeId,
  createShareURL,
  activeShareURL,
} from '@extension/shared';

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

export async function redirectCurrentTab(newUrl: string) {
  try {
    // Query for the active tab in the current window
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    const activeTab = tabs[0]; // Get the active tab

    if (activeTab?.id && newUrl) {
      // Update the current active tab with the new URL
      await chrome.tabs.update(activeTab.id, { url: newUrl });

      return 'success';
    } else {
      console.error('No active tab found or invalid URL');
    }

    return 'falled';
  } catch (error) {
    console.error('Failed to redirect the tab:', error);
    return 'falled';
  }
}

export async function getCurrentURL() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (chrome.runtime.lastError) {
        reject(undefined); // Reject the promise if there's an error
      } else {
        resolve(tabs[0].url); // Resolve the promise with the active tab's URL
      }
    });
  });
}

export async function shareChatInBg() {
  const currentURL = await getCurrentURL();
  const conversationId = typeof currentURL === 'string' ? getConversationIdByURL(currentURL) : null;
  const bearerToken = await tokenStorage.get();
  const header = createHeader(bearerToken?.token);

  if (header && conversationId) {
    try {
      const currentNodeId = await getCurrentNodeId(conversationId, header);
      const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};

      const isActivatedSuccess = shareData.shareId ? await activeShareURL(shareData.shareId, header) : false;

      if (isActivatedSuccess) {
        return { success: true, msg: 'success', ...shareData };
      }

      return { success: false, msg: 'Cannot share the current chat! Please try again later!' };
    } catch (err) {
      return { success: false, msg: 'Something went wrong! try share chat again' };
    }
  } else {
    return { success: false, msg: 'Token or conversationId not found!' };
  }
}
