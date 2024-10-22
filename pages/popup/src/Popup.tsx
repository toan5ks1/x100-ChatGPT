import { gitHubUrl, openUrlNewTab, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import AccountListPage from './components/AccountList';
import { cn } from '@extension/ui/lib/utils';
import { ModeToggle } from './components/ToggleTheme';
import { GitHubLogoIcon } from '@extension/ui/components/icon';
import { Button } from '@extension/ui/components/button';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  return (
    <div
      className={cn(
        'w-80 min-h-96 flex flex-col justify-between',
        isLight ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-800 text-neutral-100',
      )}>
      <div className="px-4 pt-8 pb-2 space-y-8 flex flex-col">
        <div className="flex justify-center items-center space-x-1">
          <img src={isLight ? './logo.png' : './logo-dark.png'} className="size-6" alt="logo" />
          <h2 className="text-lg font-semibold">SorryGPT-4o</h2>
        </div>
        <AccountListPage />
      </div>
      <div
        className={cn(
          'text-center flex justify-center items-center gap-2',
          isLight ? 'bg-neutral-200' : 'bg-neutral-600',
        )}>
        <p>{`© 2024 SorryGPT - I'm$Broke!`}</p>
        <Button onClick={() => openUrlNewTab(gitHubUrl)}>
          <GitHubLogoIcon className="size-3" />
        </Button>
        <ModeToggle className="size-3" />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
