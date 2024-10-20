/* eslint-disable react/no-unescaped-entities */
import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { Cross2Icon, Icons, ShuffleIcon } from '@extension/ui/components/icon';
import { createHeader, getEmailFromAuthHeader, hostUrl, shareChat } from '@extension/shared';

import { Button } from '@extension/ui/components/button';
import { handleRedirect } from '../lib/utils';
// import { hostUrl } from '@extension/shared';
// import { Label } from '@extension/ui/components/label';
// import { CopyBtn } from './copyBtn';

interface DialogCloseButtonProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  header?: string;
}

export function DialogSharedURL({ isOpen, setIsOpen, header }: DialogCloseButtonProps) {
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
          <div className="flex flex-col bg-zinc-800 gap-6 p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                You've hit the free Plan limit for GPT-4o.
              </h2>
              <p className="text-sm text-muted-foreground">
                Don't worry, you can still use it for <b>free</b>!
              </p>
            </div>
            {/* <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link">Link</Label>
            <p className="text-sm font-medium">{url}</p>
          </div>
        </div> */}
            <div className="flex flex-col sm:flex-row justify-end space-x-2">
              <Button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 rounded-sm p-0.5 border border-zinc-700">
                <Cross2Icon className="size-4" />
              </Button>
              {/* <CopyBtn url={url} /> */}
              <Button
                onClick={handleShare}
                className="flex items-center gap-1 border border-purple-700 rounded-md px-4 py-1.5">
                Continue
                {isPending ? <Icons.spinner className="size-4 animate-spin" /> : <ShuffleIcon className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
