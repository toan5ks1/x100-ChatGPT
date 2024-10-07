import type { ComponentPropsWithoutRef } from 'react';
import { exampleThemeStorage } from '@extension/storage';
import { useStorage } from '../hooks/useStorage';

export const ToggleButton = ({ className, children }: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        className +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {children}
    </button>
  );
};
