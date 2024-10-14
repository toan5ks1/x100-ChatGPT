import { useEffect, useState } from 'react';
import { sendMessageToBackgroundAsync } from '@extension/storage/lib/service/message';
import { type Slot } from '@extension/storage/types';

export const useGetCurrentSlot = () => {
  const [slots, setSlots] = useState<Slot['id'] | undefined>();

  useEffect(() => {
    const getCurrentSlot = async () => {
      const currentSlot = await sendMessageToBackgroundAsync({
        type: 'GetCurrentSlot',
      });

      currentSlot && setSlots(currentSlot);
    };

    getCurrentSlot();
  }, []);

  return slots;
};
