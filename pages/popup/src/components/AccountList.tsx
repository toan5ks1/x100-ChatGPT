import { Button } from '@extension/ui/components/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@extension/ui/components/tooltip';
import { TrashIcon, EnterIcon, Share2Icon, Icons, PlusIcon } from '@extension/ui/components/icon';
import { useGetAllSlots } from '../hooks/useAllSlots';
import { handleDeleteSlot, removeCookie } from '@src/utils';

import { useSwitchAccount } from '../hooks/useSwitchAccount';
import { useShareChat } from '@src/hooks/useShareChat';
import { getEmailFromAuthHeader, getHeader, hostUrl } from '@extension/shared';
import { useEffect, useState } from 'react';

export const addNewSlot = () => {
  window.open(hostUrl, '_blank', 'noopener,noreferrer');
};

export default function AccountListPage() {
  const slots = useGetAllSlots();
  const [email, setEmail] = useState();
  const { isPending, selectedId, switchAccount } = useSwitchAccount();
  const { isPending: isPendingShare, selectedId: selectedIdShare, shareChat } = useShareChat();

  useEffect(() => {
    getHeader()
      .then(header => {
        const email = getEmailFromAuthHeader(header); // email equal Id
        setEmail(email);
      })
      .catch(() => {
        alert('Could not get account information!');
      });
  }, []);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {slots.map(slot => (
          <li key={slot.id} className="flex justify-between items-center">
            <div className="w-1/3 flex gap-2 items-center">
              <span className="truncate">{slot.id.split('@')[0]}</span>
              {slot.id === email && (
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-sky-500"></span>
                </span>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled={slot.id === email} size="icon" onClick={() => switchAccount(slot.id)}>
                    {isPending && selectedId === slot.id ? (
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : (
                      <EnterIcon />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-500 border border-zinc-700 px-2 py-1 text-white">
                  <p>Switch to {slot.id.split('@')[0]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled={slot.id === email} size="icon" onClick={() => shareChat(slot.id)}>
                    {isPendingShare && selectedIdShare === slot.id ? (
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : (
                      <Share2Icon />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-500 border border-zinc-700 px-2 py-1 text-white">
                  <p>Continue chatting with {slot.id.split('@')[0]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" onClick={() => handleDeleteSlot(slot.id)}>
                    <TrashIcon className="text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-500 border border-zinc-700 px-2 py-1 text-white">
                  <p>Delete {slot.id.split('@')[0]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </ul>
      {slots.length < 5 ? (
        <Button
          className="flex items-center gap-1 border border-zinc-500 rounded-md px-2 py-1"
          onClick={() => removeCookie(addNewSlot)}>
          <PlusIcon className="size-4" />
          Add profile
        </Button>
      ) : null}
    </>
  );
}
