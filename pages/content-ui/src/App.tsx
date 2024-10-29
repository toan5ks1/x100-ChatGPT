import { DialogSharedURL } from './components/shareUrlModal';
import { useEffect, useState } from 'react';
import { continueChat } from './lib/utils';

export default function App() {
  const [isOpenSharedModal, setIsOpenSharedModal] = useState(false);

  useEffect(() => {
    // Auto click Continue after redirect
    setTimeout(() => {
      continueChat();
    }, 100);
  }, []);

  return <DialogSharedURL isOpen={isOpenSharedModal} setIsOpen={setIsOpenSharedModal} />;
}
