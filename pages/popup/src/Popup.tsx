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
        'w-80 h-full min-h-96 px-4 py-8 space-y-8',
        isLight ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-800 text-neutral-100',
      )}>
      <div className="flex justify-center items-center space-x-1 relative">
        <RocketIcon className="size-6 text-orange-500" />
        <h2 className="text-lg font-semibold">SorryGPT-4o</h2>
        <ModeToggle className="absolute top-0 right-0" />
      </div>
      <AccountListPage />
      <AddProfileBtn />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
