import { MoonIcon, SunIcon } from '@extension/ui/components/icon';

import { Button } from '@extension/ui/components/button';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

export function ModeToggle({ className }: { className: string }) {
  const theme = useStorage(exampleThemeStorage);

  return (
    <Button className={className} onClick={exampleThemeStorage.toggle} aria-label="Toggle theme">
      {theme === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  );
}
