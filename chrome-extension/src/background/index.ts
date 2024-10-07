import 'webextension-polyfill';
import Logger from './utils/logger';
import { loginURL } from './utils/constant';
import { sendErrorMessageToClient, sendMessageToClient } from './utils/message';
import { type RequiredDataNullableInput } from './utils/type';
import { exhaustiveMatchingGuard } from './utils';
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
          const slots = await SlotStorage.getAllSlots();
          const updatedSlots = slots.map(slot => ({
            ...slot,
            isSelected: message.input === slot.id,
          }));
          await SlotStorage.setAllSlots(updatedSlots);
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

chrome.webRequest.onCompleted.addListener(
  async function (details) {
    if (details.statusCode === 200) {
      // Save cookies
      const cookie = await chrome.cookies.get({ url: hostUrl, name: cookieName });
      await SlotStorage.addSlot({ data: cookie });
      // Send response to client
      activePort && sendResponseWithPort(activePort, { type: 'AddNewSlot', data: 'success' });
    }
  },
  { urls: [loginURL] }, // Adjust for specific domains if needed
);
