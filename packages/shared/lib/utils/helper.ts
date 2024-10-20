import { conversationUrl, createShareUrl, litmitChatUrl } from './constant';

export function getConversationIdByURL(url: string = window.location.href) {
  return url.split('/c/')?.[1];
}

export function createHeader(token?: string) {
  if (!token) {
    return undefined;
  }
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', token);

  return myHeaders;
}

export async function onContinueChat(shareUrl: string) {
  try {
    const url = `${shareUrl}/continue?_data=routes%2Fshare.%24shareId.%28%24action%29`;
    const res = await fetch(url);
    const data = await res.json();

    return data?.serverResponse?.data?.continue_conversation_url;
  } catch (error) {
    console.log('Error making the request:', error);
    return null;
  }
}

export async function getCurrentNodeId(conversationId: string, header: Headers) {
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

export async function createShareURL(conversationId: string, currentNodeId: string, header: Headers) {
  try {
    const params = { conversation_id: conversationId, current_node_id: currentNodeId, is_anonymous: true };

    const response = await fetch(`${createShareUrl}/create`, {
      method: 'POST',
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

export async function activeShareURL(shareId: string, header: Headers) {
  try {
    const params = { is_public: true, is_visible: true, is_anonymous: true };

    const response = await fetch(`${createShareUrl}/${shareId}`, {
      method: 'PATCH',
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

export async function checkHitLimit(header: Headers) {
  try {
    const response = await fetch(litmitChatUrl, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({}),
    });
    const data = await response.json();

    return data?.banner_info === null ? false : true;
  } catch (error) {
    console.log('Error making the request:', error);
    return null;
  }
}

export async function shareChat(header: Headers) {
  const conversationId = getConversationIdByURL();
  if (header && conversationId) {
    try {
      const currentNodeId = await getCurrentNodeId(conversationId, header);
      const shareData = currentNodeId ? await createShareURL(conversationId, currentNodeId, header) : {};

      const isActivatedSuccess = shareData.shareId ? await activeShareURL(shareData.shareId, header) : false;

      if (isActivatedSuccess) {
        return { success: true, msg: 'success', ...shareData };
      }

      return { success: false, msg: 'Cannot share the current chat! Please try again later!' };
    } catch (err) {
      return { success: false, msg: 'Something went wrong! try share chat again' };
    }
  } else {
    return { success: false, msg: 'Token or conversationId not found!' };
  }
}

export async function redirectCurrentTab(tabId: number, newUrl: string) {
  try {
    if (tabId && newUrl) {
      // Update the current active tab with the new URL
      await chrome.tabs.update(tabId, { url: newUrl });

      return 'success';
    } else {
      console.error('No active tab found or invalid URL');
    }

    return 'falled';
  } catch (error) {
    console.error('Failed to redirect the tab:', error);
    return 'falled';
  }
}

export async function redirectCurrentTabV2(newUrl: string) {
  try {
    // Query for the active tab in the current window
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    const activeTab = tabs[0]; // Get the active tab

    if (activeTab?.id && newUrl) {
      // Update the current active tab with the new URL
      await chrome.tabs.update(activeTab.id, { url: newUrl });

      return 'success';
    } else {
      console.error('No active tab found or invalid URL');
    }

    return 'falled';
  } catch (error) {
    console.error('Failed to redirect the tab:', error);
    return 'falled';
  }
}
