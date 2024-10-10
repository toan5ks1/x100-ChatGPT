import { Button } from '@extension/ui/components/button';
import { useEffect } from 'react';
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
  const handleSwitch = async () => {
    const conversationId = getConversationIdByURL();
    const bearerToken = await tokenStorage.get();

    if (!conversationId && bearerToken?.token) {
      const header = createHeader(bearerToken.token);
      const isHitLimit = await checkHitLimit(header);
      alert(isHitLimit);
      // const currentNodeId = await getCurrentNodeId(conversationId, header);
      // const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};

      // const isActivatedSuccess = shareData.shareId ? await activeShareURL(shareData.shareId, header) : false;

      // alert(isActivatedSuccess + ' ' + shareData.shareUrl);
    } else {
      alert('Token or conversationId not found!');
    }
  };

  useEffect(() => {
    handleSwitch();
  }, []);

  return (
    <div className="flex items-center justify-between gap-2 bg-blue-100 rounded py-1 px-2">
      <div className="flex gap-1 text-blue-500">
        Edit <strong className="text-blue-700">pages/content-ui/src/app.tsx</strong> and save to reload.
      </div>
      <Button onClick={handleSwitch}>Toggle Theme</Button>
    </div>
  );
}
