import { conversationUrl, createShareUrl, litmitChatUrl } from './constant';

export function getConversationIdByURL() {
  const url = window.location.href;

  return url.split('/c/')?.[1];
}

export function createHeader(token: string) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', token);

  return myHeaders;
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

export async function activeShareURL(shareId: string, header: Headers) {
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

export async function checkHitLimit(header: Headers) {
  try {
    const response = await fetch(litmitChatUrl, {
      method: 'POST', // or "POST", "PUT", etc. depending on your use case
      headers: header,
      body: JSON.stringify({}),
    });
    const data = await response.json();

    return data?.banner_info === null ? false : true;
  } catch (error) {
    console.error('Error making the request:', error);
    return null;
  }
}
