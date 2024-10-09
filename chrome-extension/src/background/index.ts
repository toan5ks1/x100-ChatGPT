import Logger from './utils/logger';
import { loginURL } from './utils/constant';
import { sendErrorMessageToClient, sendMessageToClient } from './utils/message';
import { type RequiredDataNullableInput } from './utils/type';
import { exhaustiveMatchingGuard, getEmailFromAuthHeader, removeReadOnlyProperties } from './utils';
import { type Message } from '@extension/storage/types';
import { cookieName, hostUrl } from '@extension/shared/index';
import { SlotStorage } from '@extension/storage';

let activePort: chrome.runtime.Port | null = null; // Global variable to store the active port

const sendResponseWithPort = <M extends Message>(port: chrome.runtime.Port, message: RequiredDataNullableInput<M>) => {
  Logger.send(message);
  sendMessageToClient(port, message);
};

chrome.runtime.onConnect.addListener(port => {
  const sendResponse = <M extends Message>(message: RequiredDataNullableInput<M>) => {
    Logger.send(message);
    sendMessageToClient(port, message);
  };

  activePort = port; // Store the active port

  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
    activePort = null; // Reset the port when disconnected
  });

  port.onMessage.addListener(async (message: Message) => {
    Logger.receive(message);

    try {
      switch (message.type) {
        case 'GetSlots': {
          const slots = await SlotStorage.getAllSlots();
          sendResponse({ type: 'GetSlots', data: slots });
          break;
        }
        case 'SelectSlot': {
          const selectedSlot = await SlotStorage.getSlotById(message.input);
          await SlotStorage.updateSlot({ ...selectedSlot, isSelected: true });
          chrome.cookies.set(removeReadOnlyProperties(selectedSlot.data), () => {
            console.log('set cookie successully');
          });
          sendResponse({ type: 'SelectSlot', data: 'success' });
          break;
        }
        case 'DeleteSlot': {
          await SlotStorage.deleteSlot(message.input);
          sendResponse({ type: 'DeleteSlot', data: 'success' });
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

chrome.webRequest.onSendHeaders.addListener(
  async details => {
    const authHeader = details.requestHeaders?.find(header => header.name.toLowerCase() === 'authorization');
    if (authHeader?.value && authHeader.value.startsWith('Bearer')) {
      const email = getEmailFromAuthHeader(authHeader.value);
      const cookie = await chrome.cookies.get({ url: hostUrl, name: cookieName });

      await SlotStorage.addSlot({ id: email, data: cookie });
      // Send response to client
      activePort && sendResponseWithPort(activePort, { type: 'AddNewSlot', data: 'success' });
    }
  },
  { urls: [loginURL] }, // Adjust for specific domains if needed
  ['requestHeaders', 'extraHeaders'],
);
