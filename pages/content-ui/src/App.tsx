import { DialogSharedURL } from './components/shareUrlModal';
import { useCallback, useEffect, useState } from 'react';
import { tokenStorage } from '@extension/storage';
import {
  getConversationIdByURL,
  checkHitLimit,
  createHeader,
  getCurrentNodeId,
  createShareURL,
  activeShareURL,
} from '@extension/shared';

export default function App() {
  const [sharedUrl, setSharedUrl] = useState(undefined);
  const [messageCount, setMessageCount] = useState(0);
  const [isOpenSharedModal, setIsOpenSharedModal] = useState(false);

  const checkLimitAsync = useCallback(async () => {
    const bearerToken = await tokenStorage.get();
    const header = createHeader(bearerToken?.token);

    if (header) {
      const isHitLimit = await checkHitLimit(header);

      if (isHitLimit) {
        const conversationId = getConversationIdByURL();

        if (conversationId) {
          const currentNodeId = await getCurrentNodeId(conversationId, header);
          const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};

          const isActivatedSuccess = shareData.shareId ? await activeShareURL(shareData.shareId, header) : false;

          if (isActivatedSuccess) {
            setSharedUrl(shareData.shareUrl);
            setIsOpenSharedModal(true);
          } else {
            alert('Cannot share the current chat! Please try again later!');
          }
        } else {
          alert('Token or conversationId not found!');
        }
      }
    }
  }, []);

  const addConversationListener = () => {
    chrome.runtime.onConnect.addListener(function (port) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      port.onMessage.addListener((responseMessage: any) => {
        if (responseMessage.type === 'MessageSent') {
          setMessageCount(pre => pre + 1);
        }
      });
    });
  };

  useEffect(() => {
    addConversationListener();
    checkLimitAsync();
  }, []);

  useEffect(() => {
    checkLimitAsync();
  }, [messageCount]);

  return (
    <>
      <DialogSharedURL isOpen={isOpenSharedModal} setIsOpen={setIsOpenSharedModal} url={sharedUrl} />
    </>
  );
}
