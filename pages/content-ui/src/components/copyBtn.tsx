import { Button } from '@extension/ui/components/button';
import { CheckIcon, Link2Icon } from '@extension/ui/components/icon';

import React, { useState } from 'react';

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
  }
}

export const CopyBtn = ({ url }: { url: string }) => {
  // Function to copy text to clipboard
  const [isCp, setIsCp] = useState(false);

  const handleCp = async () => {
    await copyToClipboard(url);
    setIsCp(true);

    setTimeout(() => {
      setIsCp(false);
    }, 2000);
  };

  return (
    <Button onClick={handleCp} className="flex items-center gap-1 bg-zinc-700 rounded-md px-4 py-1.5">
      Copy Link
      {isCp ? <CheckIcon className="size-4" /> : <Link2Icon className="size-4" />}
    </Button>
  );
};
