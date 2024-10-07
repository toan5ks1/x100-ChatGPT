import 'webextension-polyfill';
import Logger from './utils/logger';
import { sendErrorMessageToClient, sendMessageToClient } from './utils/message';
import { type RequiredDataNullableInput } from './utils/type';
import { exhaustiveMatchingGuard } from './utils';
import { type Message } from '@extension/storage/types';
import { cookieName, hostUrl } from './utils/const';

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
  });
  port.onMessage.addListener(async (message: Message) => {
    Logger.receive(message);

    const sendResponse = <M extends Message>(message: RequiredDataNullableInput<M>) => {
      Logger.send(message);
      sendMessageToClient(port, message);
    };

    try {
      switch (message.type) {
        case 'GetSlots': {
          // const slots = await SlotStorage.getAllSlots();

          chrome.cookies.get({ url: hostUrl, name: cookieName }, cookie => {
            if (cookie) {
              console.log(`Cookie found: ${cookie.value}`);
              // sendResponse({ type: 'GetSlots', data: slots });
            } else {
              console.log(`Cookie ${cookieName} not found`);
            }
          });
          // sendResponse({ type: 'GetSlots', data: slots });
          break;
        }
        case 'SelectSlot': {
          const updatedSlots = 'ss';
          sendResponse({ type: 'SelectSlot', data: updatedSlots });
          break;
        }
        default: {
          exhaustiveMatchingGuard(message);
        }
      }
    } catch (error) {
      Logger.warn(error);
      sendErrorMessageToClient(port, error);
    }
  });
});
