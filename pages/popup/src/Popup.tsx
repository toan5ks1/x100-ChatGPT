import { ToggleButton, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import AccountListPage from './components/AccountList';
import { cn } from '@extension/ui/lib/utils';
import AddProfileBtn from './components/AddProfileBtn';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';
  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  return (
    <div className={cn('w-80 h-96', isLight ? 'bg-slate-50' : 'bg-gray-800')}>
      <header className={cn('h-full', isLight ? 'text-gray-900' : 'text-gray-100')}>
        <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="" alt="logo" />
        </button>
        <AccountListPage />
        <AddProfileBtn />
        <ToggleButton>Toggle theme</ToggleButton>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
