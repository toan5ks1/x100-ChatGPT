import React, { type Dispatch, type SetStateAction } from 'react';
import { ArrowRightIcon } from '@extension/ui/components/icon';

import { Button } from '@extension/ui/components/button';
import { Label } from '@extension/ui/components/label';

interface DialogCloseButtonProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  url?: string;
}

export function redirectCurrentTab(newUrl: string) {
  // Query for the active tab in the current window
  window.location.href = newUrl;
}

export function DialogSharedURL({ isOpen, setIsOpen, url = 'https://chatgpt.com' }: DialogCloseButtonProps) {
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col bg-zinc-800 gap-4 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            You've hit the free plan limit for GPT-4o
          </h2>
          <p className="text-sm text-muted-foreground">Don't worry, you can still use it for free!</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link">Link</Label>
            <p className="text-sm font-medium">{url}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-x-2">
          <Button onClick={() => setIsOpen(false)} className="bg-zinc-700 rounded-md py-1.5">
            Close
          </Button>
          <Button
            onClick={() => redirectCurrentTab(url)}
            className="flex items-center gap-1 bg-zinc-700 rounded-md py-1.5">
            Continue with another profile
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
