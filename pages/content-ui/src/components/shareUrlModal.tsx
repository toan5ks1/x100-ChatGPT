/* eslint-disable react/no-unescaped-entities */
import React, { type Dispatch, type SetStateAction } from 'react';
import { Cross2Icon, EnterIcon } from '@extension/ui/components/icon';

import { Button } from '@extension/ui/components/button';
import { Label } from '@extension/ui/components/label';
import { hostUrl } from '@extension/shared';
import { CopyBtn } from './copyBtn';

interface DialogCloseButtonProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onContinue: () => void;
  url?: string;
}

export function DialogSharedURL({ isOpen, setIsOpen, onContinue, url = hostUrl }: DialogCloseButtonProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col bg-zinc-800 gap-4 p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            You've hit the free Plan limit for GPT-4o.
          </h2>
          <p className="text-sm text-muted-foreground">
            Don't worry, you can still use it for <b>free</b>!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link">Link</Label>
            <p className="text-sm font-medium">{url}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-x-2">
          <CopyBtn url={url} />
          <Button
            onClick={() => setIsOpen(false)}
            className="absolute right-0 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="size-4" />
          </Button>
          <Button
            onClick={onContinue}
            className="flex items-center gap-1 border border-purple-700 rounded-md px-4 py-1.5">
            Continue
            <EnterIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
