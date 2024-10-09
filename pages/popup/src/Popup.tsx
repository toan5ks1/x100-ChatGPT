import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import AccountListPage from './components/AccountList';
import { cn } from '@extension/ui/lib/utils';
import AddProfileBtn from './components/AddProfileBtn';
import { RocketIcon } from '@extension/ui/components/icon';
import { ModeToggle } from './components/ToggleTheme';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  return (
    <div
      className={cn(
        'w-80 h-96 px-4 py-6 space-y-6',
        isLight ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-800 text-neutral-100',
      )}>
      <div className="flex justify-between items-center">
        <RocketIcon className="size-5 text-orange-500" />
        {/* <img src={chrome.runtime.getURL('popup/logo.png')} className="w-16 h-auto" alt="logo" /> */}
        <h2 className="text-lg font-semibold">Unlimited ChatGPT</h2>
        <ModeToggle />
      </div>
      <AccountListPage />
      <AddProfileBtn />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
