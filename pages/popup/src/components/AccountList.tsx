import { Button } from '@extension/ui/components/button';
import { TrashIcon, EnterIcon, Share2Icon } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { getSwitchURL, handleDeleteSlot, handleSelectSlot, redirectCurrentTab, shareChatInBg } from '@src/utils';

import { onContinueChat } from '@extension/shared';

const handleShare = async (slotId: string) => {
  try {
    const shareData = await shareChatInBg();

    if (shareData.success && shareData.shareUrl && shareData.shareId) {
      handleSelectSlot(slotId, async () => {
        const result = await redirectCurrentTab(shareData.shareUrl!);
        if (result === 'success') {
          onContinueChat(shareData.shareId!);
        }
      });
    } else {
      console.log(shareData.msg ?? 'Share chat failed!');
    }
  } finally {
    console.log('redirect done');
  }
};

const handleSwitch = async (slotId: string) => {
  try {
    const targetURL = await getSwitchURL();
    handleSelectSlot(slotId, async () => {
      await redirectCurrentTab(targetURL);
    });
  } finally {
    console.log('redirect done');
  }
};

export default function AccountListPage() {
  const slots = useGetAllSlots();

  return (
    <ul className="flex flex-col gap-3">
      {slots.map(slot => (
        <li key={slot.id} className="flex justify-between items-center">
          <span className="w-1/3 truncate">{slot.id.split('@')[0]}</span>
          <Button size="icon" onClick={() => handleSwitch(slot.id)}>
            <EnterIcon />
          </Button>
          <Button size="icon" onClick={() => handleShare(slot.id)}>
            <Share2Icon />
          </Button>
          <Button size="icon" onClick={() => handleDeleteSlot(slot.id)}>
            <TrashIcon className="text-red-500" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
