import { Button } from '@extension/ui/components/button';
import { TrashIcon, EnterIcon } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { handleDeleteSlot, handleSelectSlot } from '@src/utils';

export default function AccountListPage() {
  const slots = useGetAllSlots();

  return (
    <ul className="flex flex-col gap-2">
      {slots.map(slot => (
        <li key={slot.id} className="flex justify-between items-center">
          <span className="w-1/3 truncate">{slot.id.split('@')[0]}</span>
          <Button size="icon" onClick={() => handleSelectSlot(slot.id)}>
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
