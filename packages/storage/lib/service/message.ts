import { type ErrorMessage, type Message } from '../../types';
export type GetDataType<T extends Message['type']> = Exclude<
  Extract<
    Message,
    {
      type: T;
      data?: unknown;
      input?: unknown;
    }
  >['data'],
  undefined
>;

export async function sendMessageToBackgroundAsync<M extends Message>(message: M) {
  return new Promise<GetDataType<M['type']>>((resolve, reject) => {
    try {
      sendMessageToBackground({
        message,
        handleSuccess: resolve,
        handleError: reject,
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function sendMessageToBackground<M extends Message>({
  message,
  handleSuccess,
  handleError,
}: {
  message: M;
  handleSuccess?: (data: GetDataType<M['type']>) => void;
  handleError?: (error: Error) => void;
}) {
  const port = chrome.runtime.connect();
  port.onMessage.addListener((responseMessage: M | ErrorMessage) => {
    if (responseMessage.type === 'Error') {
      handleError?.(responseMessage.error);
    } else {
      handleSuccess?.(responseMessage.data as GetDataType<M['type']>);
    }
  });
  port.onDisconnect.addListener(() => console.log('Port disconnected'));
  try {
    port.postMessage(message);
  } catch (error) {
    console.log(error);
  }
  const disconnect = () => {
    port.disconnect();
  };
  return { disconnect };
}
