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

export function getEmailFromAuthHeader(authHeaderValue?: string) {
  if (!authHeaderValue) {
    return null;
  }

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

export function findAvailableSlot(slots: Slot[], id?: string) {
  const index = slots.findIndex(slot => slot.id === id);

  if (index === -1 || index === slots.length - 1) {
    return slots[0];
  } else {
    return slots[index + 1];
  }
}
