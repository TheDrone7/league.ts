import type { Client } from '../client';
import type { BaseManager, FetchOptions, SummonerSpellData } from '../types';
import { SummonerSpell } from '../structures';
import { Collection } from '@discordjs/collection';
import { StorageManager } from './index';
import path from 'path';

/**
 * A spell manager - to fetch and manage all summoner spell data.
 */
export class SummonerSpellManager implements BaseManager<SummonerSpell> {
  /**
   * A collection of the summoner spells cached in the memory.
   *
   * Only use this if you absolutely must.
   * Prioritize using {@link SummonerSpellManager.fetch | fetch} instead.
   */
  readonly cache: Collection<string, SummonerSpell>;
  /**
   * The client this manager belongs to.
   */
  readonly client: Client;
  private readonly _spellsData?: StorageManager;

  /**
   * Creates a new summoner spell manager.
   * @param client - The client this manager belongs to.
   * @param cacheSettings - The cache settings to use.
   */
  constructor(client: Client, cacheSettings: { enable: boolean; root: string }) {
    this.client = client;
    this.cache = new Collection<string, SummonerSpell>();
    if (cacheSettings.enable) this._spellsData = new StorageManager(client, 'dDragon/spells', cacheSettings.root);
  }

  private async _fetchLocalSpells() {
    if (this._spellsData)
      this._spellsData.pathName = path.join('dDragon', this.client.version, this.client.locale, 'spells');
    return new Promise(async (resolve, reject) => {
      this.client.logger?.trace(`Fetching runes from local storage`);
      const data = this._spellsData?.fetch('spells');
      if (data) resolve(data);
      else {
        this.client.logger?.trace(`Fetching runes from DDragon`);
        const response = await this.client.http.get(`${this.client.version}/data/${this.client.locale}/summoner.json`);
        if (response.status !== 200) reject('Unable to fetch summoner spells from Data dragon');
        else {
          this._spellsData?.store('spells', response.data.data);
          resolve(response.data.data);
        }
      }
    });
  }

  private async _fetchAll(options?: FetchOptions) {
    return new Promise(async (resolve, reject) => {
      const cache = options?.cache ?? true;
      const spells = <{ [id: string]: SummonerSpellData }>await this._fetchLocalSpells().catch(reject);
      for (const key of Object.keys(spells)) {
        const summonerSpell = new SummonerSpell(this.client, spells[key]);
        if (cache) this.cache.set(key, summonerSpell);
      }
      resolve(this.cache);
    });
  }

  /**
   * Fetch a spell by its ID. The ID is usually something like Summoner\{Spell\}
   * For example, for the spell `Flash`, the ID is `SummonerFlash`.
   * But there are a lot of exceptions to this,
   * so it is recommended to use {@link SummonerSpellManager.fetchByName | fetchByName} instead.
   *
   * @param key - The ID of the spell to fetch.
   * @param options - The basic fetching options.
   */
  async fetch(key: string, options?: FetchOptions) {
    const force = options?.force ?? false;
    return new Promise<SummonerSpell>(async (resolve, reject) => {
      if (this.cache.has(key) && !force) resolve(this.cache.get(key)!);
      else {
        await this._fetchAll(options);
        if (this.cache.has(key)) resolve(this.cache.get(key)!);
        else reject('There is no spell with that ID');
      }
    });
  }

  /**
   * Find a spell by its name.
   *
   * @deprecated Please use {@link SummonerSpellManager.fetchByName | fetchByName} instead.
   * @param name - The name of the spell to look for.
   */
  async findByName(name: string) {
    return this.fetchByName(name);
  }

  /**
   * Fetch a spell by its name.
   * The search is case-insensitive.
   * The special characters are NOT ignored.
   *
   * @param name - The name of the spell to look for.
   * @param options - The basic fetching options.
   */
  async fetchByName(name: string, options?: FetchOptions) {
    const force = options?.force ?? false;
    if (!this.cache.size || force) await this._fetchAll(options);
    return this.cache.find((i) => i.name.toLowerCase().includes(name.toLowerCase()));
  }
}
