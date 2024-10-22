/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { getCurrentURL, handleSelectSlotRedirect } from '@src/utils';

export const useSwitchAccount = () => {
  const [isPending, setIsPending] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const switchAccount = async (slotId: string) => {
    setSelectedId(slotId);

    try {
      const tabInfo = await getCurrentURL();
      const { url, tabId } = tabInfo as any;

      if (url && tabId) {
        setIsPending(true);
        handleSelectSlotRedirect({ id: slotId, url, tabId });
      }
      setTimeout(() => {
        setIsPending(false);
      }, 2000); // add a holdon, it's too fast!
    } catch (err) {
      console.error(JSON.stringify(err));
    }
  };

  return { isPending, selectedId, switchAccount };
};
