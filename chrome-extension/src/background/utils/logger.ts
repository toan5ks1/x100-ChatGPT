import { type Message } from '@extension/storage/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const Logger = {
  receive: (message: Message) => {
    console.log(
      'Message Receive:',
      `${message.type}\ninput: ${message.input ? JSON.stringify(message.input) : 'none'}`,
    );
  },
  send: (message: { type: any; data?: any }) => {
    console.log(
      'Message Sending:',
      `${message.type}\ndata: ${typeof message.data === 'string' ? message.data : 'some data'}`,
    );
  },
  warn: console.warn,
  error: console.error,
};

export default Logger;
