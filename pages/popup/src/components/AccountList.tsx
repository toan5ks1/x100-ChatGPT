import { Button } from '@extension/ui/components/button';
import { TrashIcon, EnterIcon } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { handleDeleteSlot, handleSelectSlot, redirectCurrentTab, shareChatInBg } from '@src/utils';

import { hostUrl, onContinueChat } from '@extension/shared';

export default function AccountListPage() {
  const slots = useGetAllSlots();

  const handleSwitch = async (slotId: string) => {
    const shareData = await shareChatInBg();

    if (shareData.success) {
      handleSelectSlot(slotId, () =>
        redirectCurrentTab(shareData.shareUrl).then(data => {
          data === 'success' && onContinueChat(shareData.shareId);
        }),
      );
    } else {
      console.log(shareData.msg ?? 'Share chat failed!');
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
