import { Button } from '@extension/ui/components/button';
import { TrashIcon, EnterIcon } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { handleDeleteSlot, handleSelectSlot } from '@src/utils';
import { tokenStorage } from '@extension/storage';

import {
  getConversationIdByURL,
  createHeader,
  getCurrentNodeId,
  createShareURL,
  activeShareURL,
  hostUrl,
} from '@extension/shared';

async function getCurrentURL() {
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

function redirectCurrentTab(newUrl: string) {
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

export default function AccountListPage() {
  const slots = useGetAllSlots();
  const handleSwitch = async (slotId: string) => {
    const currentURL = await getCurrentURL();
    const conversationId = typeof currentURL === 'string' ? getConversationIdByURL(currentURL) : null;
    const bearerToken = await tokenStorage.get();

    if (conversationId && bearerToken?.token) {
      const header = createHeader(bearerToken.token);
      const currentNodeId = await getCurrentNodeId(conversationId, header);
      const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};
      const isActivatedSuccess = shareData.shareId ? await activeShareURL(shareData.shareId, header) : false;

      isActivatedSuccess
        ? handleSelectSlot(slotId, () => redirectCurrentTab(shareData.shareUrl))
        : alert('Cannot share the current chat! Please try again later!');
    } else {
      alert('Token or conversationId not found!');
      handleSelectSlot(slotId, () => redirectCurrentTab(hostUrl));
    }
  };

  return (
    <ul className="flex flex-col gap-2">
      {slots.map(slot => (
        <li key={slot.id} className="flex justify-between items-center">
          <span className="w-1/3 truncate">{slot.id.split('@')[0]}</span>
          <Button size="icon" onClick={() => handleSwitch(slot.id)}>
            <EnterIcon />
          </Button>
          <Button size="icon" onClick={() => handleDeleteSlot(slot.id)}>
            <TrashIcon className="text-red-500" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
