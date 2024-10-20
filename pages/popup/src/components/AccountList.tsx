import { Button } from '@extension/ui/components/button';
import { TrashIcon, EnterIcon, Share2Icon, Icons } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { handleDeleteSlot } from '@src/utils';

import { useSwitchAccount } from '../hooks/useSwitchAccount';
import { useShareChat } from '@src/hooks/useShareChat';

export default function AccountListPage() {
  const slots = useGetAllSlots();
  const { isPending, selectedId, switchAccount } = useSwitchAccount();
  const { isPending: isPendingShare, selectedId: selectedIdShare, shareChat } = useShareChat();

  return (
    <ul className="flex flex-col gap-3">
      {slots.map(slot => (
        <li key={slot.id} className="flex justify-between items-center">
          <span className="w-1/3 truncate">{slot.id.split('@')[0]}</span>
          <Button size="icon" onClick={() => switchAccount(slot.id)}>
            {isPending && selectedId === slot.id ? <Icons.spinner className="size-4 animate-spin" /> : <EnterIcon />}
          </Button>
          <Button size="icon" onClick={() => shareChat(slot.id)}>
            {isPendingShare && selectedIdShare === slot.id ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <Share2Icon />
            )}
          </Button>
          <Button size="icon" onClick={() => handleDeleteSlot(slot.id)}>
            <TrashIcon className="text-red-500" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
