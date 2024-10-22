/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { getCurrentURL, handleShareChatRedirect } from '@src/utils';

export const useShareChat = () => {
  const [isPending, setIsPending] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const shareChat = async (slotId: string) => {
    setSelectedId(slotId);

    try {
      const tabInfo = await getCurrentURL();
      const { url, tabId } = tabInfo as any;

      if (url && tabId) {
        setIsPending(true);
        handleShareChatRedirect({ id: slotId, url, tabId });
      }
      setTimeout(() => {
        setIsPending(false);
      }, 2000); // add a holdon, it's too fast!
    } catch (err) {
      console.error(JSON.stringify(err));
    }
  };

  return { isPending, selectedId, shareChat };
};
