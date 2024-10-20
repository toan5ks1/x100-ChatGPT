import { DialogSharedURL } from './components/shareUrlModal';
import { useEffect, useState } from 'react';
import { tokenStorage } from '@extension/storage';
import { checkHitLimit, createHeader, type ShareChat, shareChat } from '@extension/shared';
import { continueChat, handleRedirect } from './lib/utils';

const addConversationListener = (updateCount: () => void) => {
  const port = chrome.runtime.connect();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messageListener = (message: any) => {
    switch (message.type) {
      case 'MessageSent':
        console.log('Received message: MessageSent');
        updateCount();
        break;
      case 'UrlChanged':
        console.log('Received message: UrlChanged');
        updateCount();
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  port.onMessage.addListener(messageListener);

  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
  });

  // Return a cleanup function
  return () => {
    port.onMessage.removeListener(messageListener); // Clean up the listener
    port.disconnect(); // Disconnect the port
  };
};

export default function App() {
  const [sharedData, setSharedData] = useState<ShareChat>({});
  const [messageCount, setMessageCount] = useState(0);
  const [isOpenSharedModal, setIsOpenSharedModal] = useState(false);

  const checkLimitAutoShare = async () => {
    const bearerToken = await tokenStorage.get();
    const header = createHeader(bearerToken?.token);

    if (header) {
      const isHitLimit = await checkHitLimit(header);

      if (isHitLimit) {
        const shareData = await shareChat(header);

        if (shareData.success) {
          setIsOpenSharedModal(true);
          setSharedData(shareData);
        } else {
          // alert(shareData.msg ?? 'Share chat failed!');
          console.log(shareData.msg ?? 'Share chat failed!');
        }
      }
    }
  };

  useEffect(() => {
    checkLimitAutoShare();
  }, [messageCount]);

  useEffect(() => {
    console.log(isOpenSharedModal);
  }, [isOpenSharedModal]);

  useEffect(() => {
    continueChat();

    const cleanup = addConversationListener(() => setMessageCount(pre => pre + 1));

    return cleanup;
  }, []);

  return (
    <div>
      <DialogSharedURL
        isOpen={isOpenSharedModal}
        setIsOpen={setIsOpenSharedModal}
        url={sharedData.shareUrl}
        onContinue={() => handleRedirect(sharedData.shareUrl)}
      />
    </div>
  );
}
