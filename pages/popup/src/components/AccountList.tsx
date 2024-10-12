import { Button } from '@extension/ui/components/button';
import { TrashIcon, EnterIcon } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { handleDeleteSlot, handleSelectSlot, redirectCurrentTab } from '@src/utils';
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

export default function AccountListPage() {
  const slots = useGetAllSlots();
  const handleSwitch = async (slotId: string) => {
    const currentURL = await getCurrentURL();
    const conversationId = typeof currentURL === 'string' ? getConversationIdByURL(currentURL) : null;
    const bearerToken = await tokenStorage.get();
    const header = createHeader(bearerToken?.token);

    if (conversationId && header) {
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
