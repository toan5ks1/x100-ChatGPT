import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type BearerToken = {
  token?: string;
};

type TokenStorage = BaseStorage<BearerToken> & {
  get: () => Promise<BearerToken>;
  set: (token: BearerToken) => Promise<void>;
};

const storage = createStorage<BearerToken>(
  'token-storage-key',
  { token: undefined },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// You can extend it with your own methods
export const tokenStorage: TokenStorage = {
  ...storage,
  get: async () => {
    return await storage.get();
  },
  set: async token => {
    return await storage.set(token);
  },
};
