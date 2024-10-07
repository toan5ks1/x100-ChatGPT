import { type ErrorMessage, type Message } from '@extension/storage/types';

export function sendMessageToClient(
  port: chrome.runtime.Port,
  message: { type: Message['type']; data: Message['data'] } | ErrorMessage,
) {
  try {
    port.postMessage(message);
  } catch (error) {
    console.log(error);
  }
}

export function sendErrorMessageToClient(port: chrome.runtime.Port, error: unknown) {
  const sendError = new Error();
  sendError.name = 'Unknown Error';

  if (error instanceof Error) {
    error.name && (sendError.name = error.name);
    sendError.message = error.message;
  }

  sendMessageToClient(port, { type: 'Error', error: sendError });
}
