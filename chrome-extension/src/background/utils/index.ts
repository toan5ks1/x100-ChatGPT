import { hostUrl } from '@extension/shared';
import { profileKey } from './constant';
import { type Slot } from '@extension/storage/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function exhaustiveMatchingGuard(_: any) {
  throw new Error('should not here');
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export function getEmailFromAuthHeader(authHeaderValue: string) {
  const token = authHeaderValue.split(' ')[1];

  const decodedToken = parseJwt(token);
  const email = decodedToken[profileKey].email;

  return email;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeReadOnlyProperties(cookieData: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hostOnly, session, storeId, ...cleanedCookie } = cookieData;
  return { ...cleanedCookie, url: hostUrl };
}

export function minutesBetweenDates(date1: Date, date2: Date): number {
  // Convert the dates to milliseconds
  const millisecondsBetween = date2.getTime() - date1.getTime();

  // Convert milliseconds to minutes
  const minutesBetween = millisecondsBetween / (1000 * 60);

  return minutesBetween;
}

export function findAvailableSlot(slots: Slot[]) {
  return slots.find(slot => minutesBetweenDates(slot.data.expTime, new Date()) > 10);
}

export function findCurrentSlot(slots: Slot[]) {
  return slots.find(slot => slot.data.isSelected);
}
