import { Button } from '@extension/ui/components/button';
import { useEffect } from 'react';
import { tokenStorage } from '@extension/storage';
import { conversationUrl, createShareUrl } from '@extension/shared';

function getConversationIdByURL() {
  const url = window.location.href;

  return url.split('/c/')?.[1];
}

function createHeader(token: string) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', token);

  return myHeaders;
}

async function getCurrentNodeId(conversationId: string, header: Headers) {
  try {
    const response = await fetch(`${conversationUrl}/${conversationId}`, {
      method: 'GET', // or "POST", "PUT", etc. depending on your use case
      headers: header,
    });
    const data = await response.json();

    return data?.current_node as string | undefined;
  } catch (error) {
    console.error('Error making the request:', error);
    return null;
  }
}

async function createShareURL(conversationId: string, currentNodeId: string, header: Headers) {
  try {
    const params = { conversation_id: conversationId, current_node_id: currentNodeId, is_anonymous: true };

    const response = await fetch(`${createShareUrl}/create`, {
      method: 'POST', // or "POST", "PUT", etc. depending on your use case
      headers: header,
      body: JSON.stringify(params),
    });
    const data = await response.json();

    return { shareId: data?.share_id, shareUrl: data?.share_url };
  } catch (error) {
    console.error('Error making the request:', error);
    return {};
  }
}

async function activeShareURL(shareId: string, header: Headers) {
  try {
    const params = { is_public: true, is_visible: true, is_anonymous: true };

    const response = await fetch(`${createShareUrl}/${shareId}`, {
      method: 'PATCH', // or "POST", "PUT", etc. depending on your use case
      headers: header,
      body: JSON.stringify(params),
    });
    const data = await response.json();

    return Boolean(data);
  } catch (error) {
    console.error('Error making the request:', error);
    return false;
  }
}

export default function App() {
  const handleSwitch = async () => {
    const conversationId = getConversationIdByURL();
    const bearerToken = await tokenStorage.get();

    if (conversationId && bearerToken?.token) {
      const header = createHeader(bearerToken.token);
      const currentNodeId = await getCurrentNodeId(conversationId, header);
      const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};

      const isActivatedSuccess = shareData.shareId ? await activeShareURL(shareData.shareId, header) : false;

      alert(isActivatedSuccess + ' ' + shareData.shareUrl);
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
