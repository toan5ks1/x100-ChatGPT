/* eslint-disable react/no-unescaped-entities */
import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { Cross2Icon, HeartFilledIcon, Icons, ShuffleIcon } from '@extension/ui/components/icon';
import {
  buyCoffeeUrl,
  createHeader,
  getEmailFromAuthHeader,
  hostUrl,
  openUrlNewTab,
  shareChat,
} from '@extension/shared';

import { Button } from '@extension/ui/components/button';
import { handleRedirect } from '../lib/utils';

interface DialogCloseButtonProps {
  isOpen: boolean;
  isHitLimit: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  header?: string;
}

export function DialogSharedURL({ isOpen, isHitLimit, setIsOpen, header }: DialogCloseButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleShare = async () => {
    if (!header) {
      alert('Could not get account information!');
      return;
    }

    setIsPending(true);
    const authHeader = createHeader(header);
    const email = getEmailFromAuthHeader(header); // email equal Id
    const shareData = await shareChat(authHeader);

    if (typeof email === 'string' && shareData?.success && shareData?.shareUrl) {
      handleRedirect(email, shareData.shareUrl);
    } else if (typeof email === 'string') {
      handleRedirect(email, hostUrl);
      console.log(shareData.msg ?? 'Share chat failed!');
    }

    setTimeout(() => {
      setIsPending(false);
    }, 2000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-2 right-2 flex items-center gap-1 bg-zinc-700 border border-purple-700 rounded-full p-2">
        <ShuffleIcon className="size-4" />
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col bg-zinc-800 gap-8 p-4 rounded-lg shadow-lg w-full max-w-sm relative text-white">
            <div className="flex flex-col space-y-2 mt-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-tight tracking-tight">
                {isHitLimit
                  ? "You've hit the free Plan limit for GPT-4o."
                  : "Hi there! 👋, If you've hit the free Plan limit for GPT-4o."}
              </h2>
              <p className="text-sm text-muted-foreground">
                Don't worry, you can still use it for <b>free</b>!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <Button
                onClick={() => openUrlNewTab(buyCoffeeUrl)}
                className="flex items-center gap-1.5 bg-zinc-700 rounded-md px-4 py-1.5 ml-0">
                <HeartFilledIcon className="size-4" />
                Buy me a coffee
              </Button>
              <Button
                onClick={handleShare}
                className="flex items-center gap-1.5 border border-purple-700 rounded-md px-3 py-1">
                Continue
                {isPending ? <Icons.spinner className="size-4 animate-spin" /> : <ShuffleIcon className="size-4" />}
              </Button>
            </div>
            <Button onClick={() => setIsOpen(false)} className="absolute right-2 top-2 rounded-sm p-0.5 bg-zinc-700">
              <Cross2Icon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
