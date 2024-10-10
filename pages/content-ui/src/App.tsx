import { Button } from '@extension/ui/components/button';
import { useEffect } from 'react';
import { tokenStorage } from '@extension/storage';
import { conversationUrl } from '@extension/shared';

function getConversationIdByURL() {
  const url = window.location.href;

  return url.split('/c/')?.[1];
}

async function getCurrentNodeId(conversationId: string, token: string) {
  try {
    const response = await fetch(`${conversationUrl}/${conversationId}`, {
      method: 'GET', // or "POST", "PUT", etc. depending on your use case
      headers: {
        Authorization: `${token}`, // Adding the Bearer token
        'Content-Type': 'application/json', // If you're sending JSON data
      },
    });
    const data = await response.json();

    return data?.current_node;
  } catch (error) {
    console.error('Error making the request:', error);
    return null;
  }
}

export default function App() {
  const handleSwitch = async () => {
    const conversationId = getConversationIdByURL();
    const bearerToken = await tokenStorage.get();

    conversationId && bearerToken.token
      ? getCurrentNodeId(conversationId, bearerToken.token).then(value => {
          alert(value);
        })
      : alert('Token or conversationId not found!');
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
