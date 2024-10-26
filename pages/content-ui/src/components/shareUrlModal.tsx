/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { Cross2Icon, HeartFilledIcon, Icons, ShuffleIcon } from '@extension/ui/components/icon';
import {
  buyCoffeeUrl,
  createHeader,
  getEmailFromAuthHeader,
  hostUrl,
  openUrlNewTab,
  shareChat,
  getHeader,
} from '@extension/shared';

import { Button } from '@extension/ui/components/button';
import { handleRedirect } from '../lib/utils';

interface DialogCloseButtonProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DialogSharedURL({ isOpen, setIsOpen }: DialogCloseButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [header, setHeader] = useState<string>();
  const currentUrl = window.location.href;

  const handleShare = async () => {
    if (!header) {
      alert('Could not get account information!');
      return;
    }

    setIsPending(true);
    const authHeader = createHeader(header);
    const shareData = await shareChat(authHeader);
    const email = getEmailFromAuthHeader(header); // email equal Id

    if (typeof email === 'string' && shareData?.success && shareData?.shareUrl) {
      handleRedirect(email, shareData.shareUrl);
    } else if (typeof email === 'string') {
      handleRedirect(email, hostUrl);
      // console.log(shareData.msg ?? 'Share chat failed!');
    }

    setTimeout(() => {
      setIsPending(false);
    }, 2000);
  };

  useEffect(() => {
    getHeader()
      .then(header => {
        setHeader(header);
        // console.log(getEmailFromAuthHeader(header));
      })
      .catch(() => {
        alert('Could not get account information!');
      });
  }, [currentUrl]);

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
                {"Hi there! 👋, If you've hit the free Plan limit for GPT-4o."}
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
