import { DialogSharedURL } from './components/shareUrlModal';
import { useEffect, useState } from 'react';
import { checkHitLimit, createHeader } from '@extension/shared';
import { continueChat, getHeader } from './lib/utils';

export default function App() {
  const [isOpenSharedModal, setIsOpenSharedModal] = useState(false);
  const [header, setHeader] = useState<string>();

  const checkLimitAutoShare = async () => {
    if (header) {
      const authHeader = createHeader(header);
      const isHitLimit = await checkHitLimit(authHeader);

      if (isHitLimit) {
        setIsOpenSharedModal(true);
      }
    }
  };

  useEffect(() => {
    checkLimitAutoShare();
  }, [header]);

  useEffect(() => {
    getHeader()
      .then(header => {
        setHeader(header);
      })
      .catch(() => {
        alert('Could not get account information!');
      });

    continueChat();
  }, []);

  return (
    <>
      <DialogSharedURL isOpen={isOpenSharedModal} setIsOpen={setIsOpenSharedModal} header={header} />
    </>
  );
}
