import { type Slot } from '@extension/storage/types';

import { tokenStorage } from '@extension/storage';

import {
  getConversationIdByURL,
  createHeader,
  getCurrentNodeId,
  createShareURL,
  activeShareURL,
  hostUrl,
} from '@extension/shared';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function exhaustiveMatchingGuard(_: any) {
  throw new Error('should not here');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeReadOnlyProperties(cookieData: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hostOnly, session, storeId, ...cleanedCookie } = cookieData;
  return { ...cleanedCookie, url: hostUrl };
}

export function findAvailableSlot(slots: Slot[], id?: string) {
  const index = slots.findIndex(slot => slot.id === id);

  if (index === -1 || index === slots.length - 1) {
    return slots[0];
  } else {
    return slots[index + 1];
  }
}

// export async function redirectCurrentTab(tabId: number, newUrl: string) {
//   try {
//     if (tabId && newUrl) {
//       // Update the current active tab with the new URL
//       await chrome.tabs.update(tabId, { url: newUrl });

//       return 'success';
//     } else {
//       console.error('No active tab found or invalid URL');
//     }

//     return 'falled';
//   } catch (error) {
//     console.error('Failed to redirect the tab:', error);
//     return 'falled';
//   }
// }

// deprecated - webNavigation was removed
// export async function redirectShareUrlAutoContinue(tabId: number, sharedUrl: string) {
//   try {
//     await chrome.tabs.update(tabId, { url: sharedUrl });

//     // Wait for the tab to finish loading the first redirect
//     chrome.webNavigation.onCompleted.addListener(async function listener(details) {
//       if (details.tabId === tabId) {
//         console.log('Tab finished loading, continuing with the next steps...');

//         await onContinueChat(sharedUrl);
//         // Now, you can perform the second redirect
//         const secondUrl = `${sharedUrl}/continue`; // Update to your second URL
//         chrome.tabs.update(tabId, { url: secondUrl });
//         console.log(`Second redirect to: ${secondUrl}`);

//         // Remove the listener after the second redirect
//         chrome.webNavigation.onCompleted.removeListener(listener);
//       }
//     });
//   } catch (error) {
//     console.log('Error updating the tab:', error);
//   }
// }

export async function shareChatInBg(
  currentURL: string,
): Promise<{ success: boolean; msg: string; shareId?: string; shareUrl?: string }> {
  try {
    const conversationId = getConversationIdByURL(currentURL);

    if (!conversationId) {
      return { success: false, msg: 'ConversationId not found!' };
    }

    const bearerToken = await tokenStorage.get();

    if (!bearerToken?.token) {
      return { success: false, msg: 'Token not found!' };
    }

    const header = createHeader(bearerToken.token);
    const currentNodeId = await getCurrentNodeId(conversationId, header);
    const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};

    const isActivatedSuccess = shareData.shareId
      ? await activeShareURL(shareData.shareId, currentNodeId!, header)
      : false;

    if (isActivatedSuccess) {
      return { success: true, msg: 'success', ...shareData };
    }

    return { success: false, msg: 'Cannot share the current chat! Please try again later!' };
  } catch (err) {
    return { success: false, msg: 'Something went wrong! try share chat again' };
  }
}
