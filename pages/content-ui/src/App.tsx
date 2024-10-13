import { DialogSharedURL } from './components/shareUrlModal';
import { useCallback, useEffect, useState } from 'react';
import { tokenStorage } from '@extension/storage';
import { checkHitLimit, createHeader, onContinueChat, type ShareChat, shareChat } from '@extension/shared';
import { useGetCurrentSlot } from './hooks/useCurrentSlot';
import { handleUpdateSlot, handleAutoSelectSlot } from './lib/utils';

const handleRedirect = async (shareUrl?: string) => {
  shareUrl &&
    handleAutoSelectSlot(() => {
      window.location.href = shareUrl;
    });
};

const getShareIdFromShareUrl = () => {
  const href = window.location.href;

  return !href.includes('/continue') ? href.split('/share/')?.[1] : null;
};

export default function App() {
  const [sharedData, setSharedData] = useState<ShareChat>({});
  const [messageCount, setMessageCount] = useState(0);
  const [isOpenSharedModal, setIsOpenSharedModal] = useState(false);
  const currentSlot = useGetCurrentSlot();

  // const addConversationListener = () => {
  //   chrome.runtime.onConnect.addListener(function (port) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     port.onMessage.addListener((responseMessage: any) => {
  //       if (responseMessage.type === 'MessageSent') {
  //         console.log('message received..');
  //         setMessageCount(pre => pre + 1);
  //       }
  //     });
  //   });
  //   console.log('added listener');
  // };

  const checkLimitAutoShare = useCallback(async () => {
    const bearerToken = await tokenStorage.get();
    const header = createHeader(bearerToken?.token);

    if (header) {
      const isHitLimit = await checkHitLimit(header);

      if (isHitLimit) {
        currentSlot && handleUpdateSlot({ ...currentSlot, expTime: new Date() });
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
  }, [currentSlot]);

  useEffect(() => {
    // addConversationListener();
    checkLimitAutoShare();

    const shareId = getShareIdFromShareUrl();
    shareId && onContinueChat(shareId);
  }, []);

  useEffect(() => {
    // checkLimitAsync();
    console.log(messageCount);
  }, [messageCount]);

  return (
    <>
      <DialogSharedURL
        isOpen={isOpenSharedModal}
        setIsOpen={setIsOpenSharedModal}
        url={sharedData.shareUrl}
        onContinue={() => handleRedirect(sharedData.shareUrl)}
      />
    </>
  );
}
