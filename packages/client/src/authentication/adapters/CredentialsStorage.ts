import {
  BaseStorageSchema,
  IStorage,
  IStorageProvider,
  Storage,
  StorageSubscriber,
  StorageSubscription,
} from '@lens-protocol/storage';
import { z } from 'zod';

import { Credentials } from './Credentials';

const AuthData = z.object({
  refreshToken: z.string(),
});

type AuthData = z.infer<typeof AuthData>;

const authStorageSchema = new BaseStorageSchema('lens.credentials', AuthData);

/**
 * Stores auth credentials.
 * Access token is kept in memory.
 * Refresh token is persisted permanently.
 */
export class CredentialsStorage implements IStorage<Credentials> {
  private refreshTokenStorage: IStorage<AuthData>;
  private accessToken: string | undefined;

  constructor(storageProvider: IStorageProvider) {
    this.refreshTokenStorage = Storage.createForSchema(authStorageSchema, storageProvider);
  }

  async set({ accessToken, refreshToken }: Credentials): Promise<void> {
    this.accessToken = accessToken;

    await this.refreshTokenStorage.set({ refreshToken });
  }

  async get(): Promise<Credentials | null> {
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const accessToken = this.accessToken;

    return new Credentials(accessToken, refreshToken);
  }

  async reset(): Promise<void> {
    this.accessToken = undefined;
    await this.refreshTokenStorage.reset();
  }

  subscribe(_: StorageSubscriber<Credentials>): StorageSubscription {
    throw new Error('Method not implemented.');
  }

  private async getRefreshToken(): Promise<string | null> {
    const result = await this.refreshTokenStorage.get();

    return result?.refreshToken ?? null;
  }
}