import { BaseManager } from '@shieldbow/web';
import { FetchOptions, IChallengeConfig, ChallengePercentile, IPlayerChallenge } from 'types';
import { LolChallenge, PlayerChallenges } from 'structures';
import { Client } from 'client';
import { parseFetchOptions } from 'utilities';

/**
 * The challenge manager - handles all challenge-related API calls.
 */
export class ChallengeManager implements BaseManager<LolChallenge> {
  /**
   * The client that instantiated this manager.
   */
  client: Client;

  /**
   * Creates a new challenge manager.
   * @param client - The client that instantiated this manager.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Fetch a challenge (config) by its ID.
   * @param id - The ID of the challenge.
   * @param options - The options for fetching.
   *
   * @returns The fetched and processed challenge config.
   */
  async fetch(id: number, options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'challenges', options);

    this.client.logger?.trace(`Fetching challenge (config) with ID: ${id}`);
    const url = `/lol/challenges/v1/challenges/${id}/config`;

    try {
      const cached = await this.checkInternal(id, opts);
      if (cached) return cached;

      const data = await this.client.request<IChallengeConfig>(url, {
        regional: false,
        method: 'challengeConfigById',
        debug: 'Challenge ID: ' + id,
        region: opts.region
      });

      this.client.logger?.trace(`Fetched challenge (config) with ID: ${id}, processing`);
      return this.processData(data, opts);
    } catch (err) {
      this.client.logger?.trace(`Failed to fetch challenge (config) with ID: ${id}`);
      this.client.logger?.error(err);
      return Promise.reject(err);
    }
  }

  /**
   * Fetch the tier percentile distribution of a challenge.
   * Only cached if config is cached for the challenge, never stored.
   *
   * @param id - The ID of the challenge.
   * @param options - The options for fetching.
   *
   * @returns The fetched challenge percentiles.
   */
  async fetchChallengePercentile(id: number, options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'challenges', options);

    this.client.logger?.trace(`Fetching challenge (percentile) with ID: ${id}`);
    const url = `/lol/challenges/v1/challenges/${id}/percentile`;

    try {
      const cached = await this.checkInternal(id, opts);
      if (cached && cached.percentiles) return cached.percentiles;

      const data = await this.client.request<ChallengePercentile>(url, {
        regional: false,
        method: 'challengePercentileById',
        debug: 'Challenge ID: ' + id,
        region: opts.region
      });

      this.client.logger?.trace(`Fetched challenge (percentile) with ID: ${id}`);
      if (cached) {
        cached.percentiles = data;
        this.client.logger?.trace(`Caching challenge (config) with ID: ${id}`);
        await this.client.cache.set(`challenge:${id}`, cached);
      }
      return data;
    } catch (err) {
      this.client.logger?.trace(`Failed to fetch challenge (percentile) with ID: ${id}`);
      this.client.logger?.error(err);
      return Promise.reject(err);
    }
  }

  /**
   * Fetch all challenges (config only).
   * This always ignores the cache and storage and fetches from the API instead.
   *
   * @param options - The options for fetching.
   *
   * @returns The fetched and processed challenges.
   */
  async fetchAll(options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'challenges', options);

    this.client.logger?.trace('Fetching all challenges (config)');
    const url = '/lol/challenges/v1/challenges/config';

    try {
      const data = await this.client.request<IChallengeConfig[]>(url, {
        regional: false,
        method: 'challengesConfig',
        region: opts.region,
        debug: 'all'
      });

      this.client.logger?.trace('Fetched all challenges (config), processing');
      return data.map((d) => this.processData(d, opts));
    } catch (err) {
      this.client.logger?.trace('Failed to fetch all challenges (config)');
      this.client.logger?.error(err);
      return Promise.reject(err);
    }
  }

  /**
   * Fetch all challenges (percentile only).
   * This always ignores the cache and storage and fetches from the API instead.
   * Automatically caches the percentiles to the challenge config.
   *
   * @param options - The options for fetching (region only).
   *
   * @returns The fetched challenge percentiles.
   */
  async fetchAllPercentiles(options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'challenges', options);

    this.client.logger?.trace('Fetching all challenges (percentile)');
    const url = '/lol/challenges/v1/challenges/percentiles';

    try {
      const data = await this.client.request<Record<string, ChallengePercentile>>(url, {
        regional: false,
        method: 'challengesPercentiles',
        region: opts.region,
        debug: 'all'
      });

      this.client.logger?.trace('Fetched all challenges (percentile)');

      for (const [id, percentile] of Object.entries(data)) {
        const cached = await this.checkInternal(parseInt(id), opts);
        if (cached) cached.percentiles = percentile;
      }

      return data;
    } catch (err) {
      this.client.logger?.trace('Failed to fetch all challenges (percentile)');
      this.client.logger?.error(err);
      return Promise.reject(err);
    }
  }

  /**
   * Fetches the challenge progressions and preferences for a player.
   *
   * @param playerId - The player ID (PUUID) for the player.
   * @param options - The options for fetching.
   *
   * @returns The fetched and processed player challenges.
   */
  async fetchPlayerChallenges(playerId: string, options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'challenges', options);

    this.client.logger?.trace(`Fetching player challenges with PUUID: ${playerId}`);
    const url = `/lol/challenges/v1/players-data/${playerId}`;

    try {
      const cached = await this.checkInternalPlayer(playerId, opts);
      if (cached) return cached;

      const data = await this.client.request<IPlayerChallenge>(url, {
        regional: false,
        method: 'playerChallenges',
        region: opts.region,
        debug: 'PUUID: ' + playerId
      });

      this.client.logger?.trace(`Fetched player challenges with PUUID: ${playerId}`);
      return this.processPlayerData(playerId, data, opts);
    } catch (err) {
      this.client.logger?.trace(`Failed to fetch player challenges with ID: ${playerId}`);
      this.client.logger?.error(err);
      return Promise.reject(err);
    }
  }

  private async checkInternal(id: number, options: FetchOptions) {
    const { ignoreCache, ignoreStorage } = options;

    try {
      const cached = await this.client.cache.get<LolChallenge>(`challenge:${id}`);
      const toIgnoreCache = cached && typeof ignoreCache === 'function' ? ignoreCache(cached) : !!ignoreCache;
      if (!toIgnoreCache) {
        this.client.logger?.trace(`Fetched challenge (config) with ID: ${id} from cache`);
        return cached;
      }

      const stored = await this.client.storage.load<IChallengeConfig>(`challenge`, id.toString());
      const toIgnoreStorage = stored && typeof ignoreStorage === 'function' ? ignoreStorage(stored) : !!ignoreStorage;
      if (!toIgnoreStorage) {
        this.client.logger?.trace(`Fetched challenge (config) with ID: ${id} from storage`);
        return this.processData(stored!, options);
      }

      return undefined;
    } catch (err) {
      this.client.logger?.trace(`Challenge (config) with id ${id} not found in storage.`);
      return undefined;
    }
  }

  private async checkInternalPlayer(puuid: string, options: FetchOptions) {
    const { ignoreCache, ignoreStorage } = options;

    try {
      const cached = await this.client.cache.get<PlayerChallenges>(`player-challenges:${puuid}`);
      const toIgnoreCache = cached && typeof ignoreCache === 'function' ? ignoreCache(cached) : !!ignoreCache;
      if (!toIgnoreCache) {
        this.client.logger?.trace(`Fetched player challenges with PUUID: ${puuid} from cache`);
        return cached;
      }

      const stored = await this.client.storage.load<IPlayerChallenge>(`player-challenges`, puuid);
      const toIgnoreStorage = stored && typeof ignoreStorage === 'function' ? ignoreStorage(stored) : !!ignoreStorage;
      if (!toIgnoreStorage) {
        this.client.logger?.trace(`Fetched player challenges with PUUID: ${puuid} from storage`);
        return this.processPlayerData(puuid, stored!, options);
      }

      return undefined;
    } catch (err) {
      this.client.logger?.trace(`Player challenges with PUUID ${puuid} not found in storage.`);
      return undefined;
    }
  }

  private async processData(data: IChallengeConfig, options: FetchOptions) {
    const { store, cache } = options;
    const challenge = new LolChallenge(this.client, data);

    const toStore = typeof store === 'function' ? store(data) : !!store;
    if (toStore) {
      this.client.logger?.trace(`Storing challenge (config) with ID: ${data.id}`);
      await this.client.storage.save(`challenge`, data.id.toString(), data);
    }

    const toCache = typeof cache === 'function' ? cache(challenge) : !!cache;
    if (toCache) {
      this.client.logger?.trace(`Caching challenge (config) with ID: ${data.id}`);
      await this.client.cache.set(`challenge:${data.id}`, challenge);
    }

    return challenge;
  }

  private async processPlayerData(puuid: string, data: IPlayerChallenge, options: FetchOptions) {
    const { store, cache } = options;
    const challenge = new PlayerChallenges(this.client, data);

    const toStore = typeof store === 'function' ? store(data) : !!store;
    if (toStore) {
      this.client.logger?.trace(`Storing player challenges for PUUID: ${puuid}`);
      await this.client.storage.save(`player-challenges`, puuid, data);
    }

    const toCache = typeof cache === 'function' ? cache(challenge) : !!cache;
    if (toCache) {
      this.client.logger?.trace(`Caching player challenges for PUUID: ${puuid}`);
      await this.client.cache.set(`player-challenges:${puuid}`, challenge);
    }

    return challenge;
  }
}
