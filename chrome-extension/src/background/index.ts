import Logger from './utils/logger';
import { loginURL } from './utils/constant';
import { sendErrorMessageToClient, sendMessageToClient } from './utils/message';
import { type RequiredDataNullableInput } from './utils/type';
import {
  exhaustiveMatchingGuard,
  findAvailableSlot,
  getEmailFromAuthHeader,
  removeReadOnlyProperties,
  shareChatInBg,
} from './utils';
import { type Message } from '@extension/storage/types';
import { cookieName, hostUrl, conversationUrl, redirectCurrentTab } from '@extension/shared/index';
import { SlotStorage, tokenStorage } from '@extension/storage';
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
          chrome.cookies.set(removeReadOnlyProperties(selectedSlot.data), () => {
            console.log('set cookie successully');
          });
          sendResponse({ type: 'SelectSlot', data: 'success' });
          break;
        }
        case 'SelectSlotRedirect': {
          const selectedSlot = await SlotStorage.getSlotById(message.input.id);
          chrome.cookies.set(removeReadOnlyProperties(selectedSlot.data), () => {
            console.log('set cookie successully');
          });

          await redirectCurrentTab(message.input.tabId, message.input.url);
          sendResponse({ type: 'SelectSlotRedirect', data: 'success' });
          break;
        }
        case 'ShareChatRedirect': {
          const selectedSlot = await SlotStorage.getSlotById(message.input.id);
          chrome.cookies.set(removeReadOnlyProperties(selectedSlot.data), () => {
            console.log('set cookie successully');
          });

          const shareData = await shareChatInBg(message.input.url);

          if (shareData.success && shareData.shareUrl && shareData.shareId) {
            await redirectCurrentTab(message.input.tabId, shareData.shareUrl);

            sendResponse({ type: 'ShareChatRedirect', data: shareData.shareUrl });
            break;
          }

          sendResponse({ type: 'ShareChatRedirect', data: 'failed' });
          break;
        }
        case 'UpdateSlot': {
          await SlotStorage.updateSlot(message.input);
          sendResponse({ type: 'UpdateSlot', data: 'success' });
          break;
        }
        case 'UpdateSlotById': {
          const selectedSlot = await SlotStorage.getSlotById(message.input.id);
          await SlotStorage.updateSlot({ ...selectedSlot, ...message.input });
          sendResponse({ type: 'UpdateSlotById', data: 'success' });
          break;
        }
        case 'AutoSelectSlot': {
          const slots = await SlotStorage.getAllSlots();
          const token = await tokenStorage.get();
          const email = getEmailFromAuthHeader(token?.token); // email equal Id
          const availableSlot = findAvailableSlot(slots, email);

          if (availableSlot) {
            chrome.cookies.set(removeReadOnlyProperties(availableSlot.data), () => {
              console.log('set cookie successully');
            });
          }

          sendResponse({ type: 'AutoSelectSlot', data: availableSlot ?? 'failed' });
          break;
        }
        case 'GetCurrentSlot': {
          const token = await tokenStorage.get();
          const email = getEmailFromAuthHeader(token?.token);
          sendResponse({ type: 'GetCurrentSlot', data: email ?? 'failed' });

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
    const token = authHeader?.value;
    if (token && token.startsWith('Bearer')) {
      const email = getEmailFromAuthHeader(token);
      const cookie = await chrome.cookies.get({ url: hostUrl, name: cookieName });

      await tokenStorage.set({ token });
      await SlotStorage.addSlot({ id: email, data: cookie });
    }
  },
  { urls: [loginURL] },
  ['requestHeaders', 'extraHeaders'],
);

chrome.webRequest.onCompleted.addListener(
  async details => {
    if (details) {
      // Send response to client to notice that the limit is hit
      activePort && sendResponseWithPort(activePort, { type: 'MessageSent', data: 'success' });
    }
  },
  { urls: [conversationUrl] },
);
