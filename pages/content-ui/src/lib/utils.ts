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

export const handleRedirect = async (shareUrl?: string) => {
  shareUrl &&
    handleAutoSelectSlot(() => {
      window.location.href = shareUrl;
    });
};
