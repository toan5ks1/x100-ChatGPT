import { sendMessageToBackgroundAsync } from '@extension/storage/lib/service/message';
import { type Slot } from '@extension/storage/types';
import { useEffect, useState } from 'react';

export const useGetAllSlots = () => {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const getSlots = async () => {
      const slots = await sendMessageToBackgroundAsync({
        type: 'GetSlots',
      });

      slots.length && setSlots(slots);
    };

    getSlots();
  }, []);

  return slots;
};
