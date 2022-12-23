import type { Client } from '../client';
import type { BaseManager, FetchOptions, ItemData } from '../types';
import { Item } from '../structures';
import { Collection } from '@discordjs/collection';
import { StorageManager } from './index';
import path from 'path';

/**
 * An item manager - to fetch and manage all item data.
 */
export class ItemManager implements BaseManager<Item> {
  /**
   * A collection of the items cached in the memory.
   *
   * Only use this if you absolutely must.
   * Prioritize using {@link ItemManager.fetch | fetch} instead.
   */
  readonly cache: Collection<string, Item>;
  /**
   * The client this manager belongs to.
   */
  readonly client: Client;
  private readonly _itemData?: StorageManager;

  /**
   * Create a new item manager.
   *
   * @param client - The client this manager belongs to.
   * @param cacheSettings - The basic caching settings.
   */
  constructor(client: Client, cacheSettings: { enable: boolean; root: string }) {
    this.client = client;
    this.cache = new Collection<string, Item>();
    if (cacheSettings.enable) this._itemData = new StorageManager(client, 'dDragon/items', cacheSettings.root);
  }

  private async _fetchLocalItems() {
    if (this._itemData)
      this._itemData.pathName = path.join('dDragon', this.client.version, this.client.locale, 'items');
    return new Promise(async (resolve, reject) => {
      this.client.logger?.trace('Fetching items from local storage');
      const data = this._itemData?.fetch('items');
      if (data) resolve(data);
      else {
        this.client.logger?.trace('Fetching items from DDragon');
        const response = await this.client.http.get(`${this.client.version}/data/${this.client.locale}/item.json`);
        if (response.status !== 200) reject('Unable to fetch items from Data dragon');
        else {
          this._itemData?.store('items', response.data.data);
          resolve(response.data.data);
        }
      }
    });
  }

  private async _fetchAll(options?: FetchOptions) {
    const cache = options?.cache ?? true;
    this.client.logger?.trace('Fetching all items');
    return new Promise(async (resolve, reject) => {
      const items = <{ [id: string]: ItemData }>await this._fetchLocalItems().catch(reject);
      for (const key of Object.keys(items)) {
        const item = new Item(this.client, key, items[key]);
        if (cache) this.cache.set(key, item);
      }
      resolve(this.cache);
    });
  }

  /**
   * Fetch an item by its 4-digit ID. The ID must be a string of 4 digits (not a number)
   *
   * @param key - The ID of the item to fetch.
   * @param options - The basic fetching options.
   */
  async fetch(key: string, options?: FetchOptions) {
    const force = options?.force ?? false;
    this.client.logger?.trace(`Fetching item ${key}`);
    return new Promise<Item>(async (resolve, reject) => {
      if (this.cache.has(key) && !force) resolve(this.cache.get(key)!);
      else {
        await this._fetchAll(options);
        if (this.cache.has(key)) resolve(this.cache.get(key)!);
        else reject('There is no item with that ID');
      }
    });
  }

  /**
   * Find an item by its name.
   *
   * @deprecated Please use {@link ItemManager.fetchByName | fetchByName} instead.
   * @param name - The name of the item to look for.
   */
  async findByName(name: string) {
    return this.fetchByName(name);
  }

  /**
   * Fetch an item by its name.
   * The search is case-insensitive.
   * The special characters are NOT ignored.
   *
   * @param name - The name of the item to look for.
   * @param options - The basic fetching options.
   */
  async fetchByName(name: string, options?: FetchOptions) {
    const force = options?.force ?? false;
    if (!this.cache.size || force) await this._fetchAll(options);
    return this.cache.find((i) => i.name.toLowerCase().includes(name.toLowerCase()));
  }
}
