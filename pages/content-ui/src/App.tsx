import { DialogSharedURL } from './components/shareUrlModal';
import { useEffect, useState } from 'react';
import { tokenStorage } from '@extension/storage';
import { checkHitLimit, createHeader, onContinueChat, type ShareChat, shareChat } from '@extension/shared';
import { getShareUrlFromHref, handleAutoSelectSlot } from './lib/utils';
import useUrlChange from './hooks/useUrlChange';

const handleRedirect = async (shareUrl?: string) => {
  shareUrl &&
    handleAutoSelectSlot(() => {
      window.location.href = shareUrl;
    });
};

// const addConversationListener = (updateCount: () => void) => {
//   const port = chrome.runtime.connect();

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const messageListener = (message: any) => {
//     switch (message.type) {
//       case 'MessageSent':
//         console.log('Received message: MessageSent');
//         updateCount();
//         break;
//       default:
//         console.log('Unknown message type:', message.type);
//     }
//   };

//   port.onMessage.addListener(messageListener);

//   port.onDisconnect.addListener(() => {
//     console.log('Port disconnected');
//   });

//   // Return a cleanup function
//   return () => {
//     port.onMessage.removeListener(messageListener); // Clean up the listener
//     port.disconnect(); // Disconnect the port
//   };
// };

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
          setSharedData(shareData);
          setIsOpenSharedModal(true);
        } else {
          // alert(shareData.msg ?? 'Share chat failed!');
          console.log(shareData.msg ?? 'Share chat failed!');
        }
      }
    }
  };
  // useUrlChange(checkLimitAutoShare);
  // useEffect(() => {
  //   checkLimitAutoShare();
  // }, [messageCount]);

  useEffect(() => {
    // const cleanup = addConversationListener(() => setMessageCount(pre => pre + 1));

    const shareUrl = getShareUrlFromHref();

    if (shareUrl) {
      onContinueChat(shareUrl).then(continueUrl => {
        if (continueUrl) {
          window.location.href = continueUrl;
          alert(continueUrl);
        }
      });
    }

    // return cleanup;
  }, []);

  return (
    // <DialogSharedURL
    //   isOpen={isOpenSharedModal}
    //   setIsOpen={setIsOpenSharedModal}
    //   url={sharedData.shareUrl}
    //   onContinue={() => handleRedirect(sharedData.shareUrl)}
    // />
    <></>
  );
}
