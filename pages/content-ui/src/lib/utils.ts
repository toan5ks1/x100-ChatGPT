import { type Slot } from '@extension/storage/types';
import { sendMessageToBackground } from '@extension/storage/lib/service/message';
import { tokenStorage } from '@extension/storage';

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

export const handleAutoSelectSlot = (currentSlotId: string, callback?: () => void) => {
  sendMessageToBackground({
    message: {
      input: currentSlotId,
      type: 'AutoSelectSlot',
    },
    handleSuccess: () => {
      callback && callback();
    },
  });
};

export const getShareUrlFromHref = () => {
  const href = window.location.href;

  return href.includes('/share/') && !href.includes('/continue') ? href : undefined;
};

export const continueChat = () => {
  const shareUrl = getShareUrlFromHref();

  if (shareUrl) {
    // Define the target URL you want to click
    const targetUrl = `${shareUrl}/continue`;
    // Select the button using an attribute selector for the href
    const button = document.querySelector(`a[href="${targetUrl}"]`) as HTMLAnchorElement;

    // Check if the button exists
    if (button) {
      // Programmatically click the button
      button.click(); // Now TypeScript recognizes this as an anchor element
    } else {
      console.log('Button not found.');
    }
  }
};

export const handleRedirect = async (currendId: string, shareUrl: string) => {
  handleAutoSelectSlot(currendId, () => {
    window.location.replace(shareUrl);
  });
};

export const getHeader = async () => {
  return tokenStorage.get().then(bearerToken => bearerToken?.token);
};

export const addConversationListener = (updateCount: () => void) => {
  const port = chrome.runtime.connect();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messageListener = (message: any) => {
    switch (message.type) {
      case 'MessageSent':
        console.log('Received message: MessageSent');
        updateCount();
        break;
      case 'UrlChanged':
        console.log('Received message: UrlChanged');
        updateCount();
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  port.onMessage.addListener(messageListener);

  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
  });

  // Return a cleanup function
  return () => {
    port.onMessage.removeListener(messageListener); // Clean up the listener
    port.disconnect(); // Disconnect the port
  };
};
