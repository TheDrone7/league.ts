import { ChampionManager, ItemManager } from 'managers';
import type {
  ClientConfig,
  Locale,
  Region,
  Season,
  GameMap,
  GameMode,
  GameType,
  Queue,
  FetchConfig,
  ILogger,
  ICache
} from 'types';
import { constants, MemoryCache, ShieldbowLogger } from 'utilities';

const patchRegex = /\d+\.\d+/;

/**
 * The shieldbow web client.
 */
export class Client {
  private _dDragonBase: string;
  private _cDragonBase: string;
  private _merakiBase: string;
  private _region: Region;
  private _locale: Locale;
  private _version: string;
  private _fetcher: <T>(url: string) => Promise<T>;
  private _defaultFetchOptions: FetchConfig;
  private _seasons: Season[];
  private _maps: GameMap[];
  private _gameModes: GameMode[];
  private _gameTypes: GameType[];
  private _queues: Queue[];
  private _logger: ILogger;
  private _cache: ICache;

  readonly champions: ChampionManager;
  readonly items: ItemManager;
  /**
   * Create a new shieldbow web client.
   */
  constructor() {
    this._cDragonBase = constants.defaultCDragonBase;
    this._dDragonBase = constants.defaultDDragonBase;
    this._merakiBase = constants.defaultMerakiABase;
    this._version = undefined!;
    this._fetcher = undefined!;
    this._region = 'na';
    this._locale = 'en_US';
    this._defaultFetchOptions = {
      cache: true,
      ignoreCache: false,
      noVersion: false
    };

    this._seasons = [];
    this._maps = [];
    this._gameModes = [];
    this._gameTypes = [];
    this._queues = [];
    this._logger = new ShieldbowLogger();
    this._cache = new MemoryCache();

    this.champions = new ChampionManager(this);
    this.items = new ItemManager(this);
  }

  /**
   * The data dragon / community dragon version to fetch from.
   */
  get version(): string {
    return this._version;
  }

  /**
   * The in-game patch that the current version corresponds to.
   *
   * This is the first two numbers of the version, and is also what the community dragon uses.
   */
  get patch(): string {
    return this.version.match(patchRegex)!.shift()!;
  }

  /**
   * The locale (language) in which the client will fetch all the data.
   */
  get locale(): Locale {
    return this._locale;
  }

  /**
   * The region from which the client will fetch all the data.
   */
  get region(): Region {
    return this._region;
  }

  /**
   * The game modes that are available (static data).
   */
  get gameModes(): GameMode[] {
    return this._gameModes;
  }

  /**
   * The game types that are available (static data).
   */
  get gameTypes(): GameType[] {
    return this._gameTypes;
  }

  /**
   * The maps that are available (static data).
   */
  get maps(): GameMap[] {
    return this._maps;
  }

  /**
   * The seasons that are available (static data, not fully up-to-date).
   */
  get seasons(): Season[] {
    return this._seasons;
  }

  /**
   * The queues that are available (static data).
   */
  get queues(): Queue[] {
    return this._queues;
  }

  /**
   * The logger used by the client.
   */
  get logger(): ILogger {
    return this._logger;
  }

  /**
   * The cache used by the client.
   */
  get cache(): ICache {
    return this._cache;
  }

  /**
   * Ensure that the client is ready to be used.
   */
  private ensureInitialized(): void {
    if (this._version === undefined) throw new Error('Client has not been initialized.');
  }

  /**
   * Generate URLs to fetch from the CDNs.
   *
   * @param path - The path to fetch from (must NOT start with a `/`).
   * @param source - The CDN to fetch from (dDragon by default).
   * @param noVersion - Whether to ignore the version (and locale) and just provide the path
   * (false by default, always true for meraki).
   * @returns The generated URL.
   */
  generateUrl(
    path: string,
    source: 'dDragon' | 'cDragon' | 'meraki' = 'dDragon',
    noVersion = !!this._defaultFetchOptions.noVersion
  ): string {
    this.ensureInitialized();
    return source === 'dDragon'
      ? `${this._dDragonBase}${noVersion ? '' : `${this.version}/data/${this.locale}/`}${path}`
      : source === 'cDragon'
      ? `${this._cDragonBase}${noVersion ? '' : this.patch + '/'}${path}`
      : `${this._merakiBase}${path}`;
  }

  generateImageUrl(path: string, source: 'dDragon' | 'cDragon' = 'dDragon'): string {
    this.ensureInitialized();
    return source === 'dDragon'
      ? `${this._dDragonBase}${this.version}/img/${path}`
      : `${this._cDragonBase}${this.patch}/${path}`;
  }

  public async initialize(config?: ClientConfig) {
    // Read and set the CDN bases.
    this._dDragonBase = config?.cdn?.cDragon ?? this._dDragonBase;
    this._cDragonBase = config?.cdn?.dDragon ?? this._cDragonBase;
    this._merakiBase = config?.cdn?.meraki ?? this._merakiBase;

    // Set up the fetch method.
    if (config?.fetchMethod) this._fetcher = config.fetchMethod;
    else {
      const { default: axios } = await import('axios');
      this._fetcher = async <T>(url: string) => {
        try {
          const { data } = await axios.get<T>(url, { validateStatus: (status) => status === 200 });
          return data;
        } catch (error) {
          return Promise.reject(error);
        }
      };
    }

    // Set the region
    // Default to NA and en_US
    this._region = config?.region ?? this._region;
    this._locale = config?.locale ?? this._locale;

    // Fetch the default versions and locales.
    const versions = await this._fetcher<{ v: string; l: Locale }>(constants.versionsUrl + this._region + '.json');
    this._version = versions.v;
    this._locale = versions.l;

    // Update version by configuration (if provided).
    const allVersions = await this._fetcher<string[]>(constants.allVersionsUrl);
    if (typeof config?.version === 'string') {
      const latestMatch = allVersions.find((v) => v.startsWith(config.version!));
      if (latestMatch) this._version = latestMatch;
    }

    // Check if appropriate versions exist.
    // Community dragon can sometimes have a delay in getting the patch live.
    const aatroxUrls = [
      this.generateUrl('champion/Aatrox.json'),
      this.generateUrl('game/data/characters/aatrox/aatrox.bin.json', 'cDragon')
    ];

    let aatrox = await Promise.all(aatroxUrls.map((u) => this._fetcher(u).catch(() => undefined)));
    while (aatrox.some((a) => a === undefined)) {
      // CDragon is not yet ready, roll back to previous patch.
      const previousPatch = allVersions.at(allVersions.indexOf(this._version) + 1);
      if (previousPatch) this._version = previousPatch;
      else throw new Error('IMPOSSIBLE: Could not find a version that is supported by the CDragon.');

      // Regenerate URLs and refetch Aatrox.
      aatroxUrls[0] = this.generateUrl('champion/Aatrox.json');
      aatroxUrls[1] = this.generateUrl('game/data/characters/aatrox/aatrox.bin.json', 'cDragon');
      aatrox = await Promise.all(aatroxUrls.map((u) => this._fetcher(u).catch(() => undefined)));
    }

    // Parse fetching options
    this._defaultFetchOptions = {
      cache: config?.defaultFetchOptions?.cache ?? true,
      ignoreCache: config?.defaultFetchOptions?.ignoreCache ?? false,
      noVersion: config?.defaultFetchOptions?.noVersion ?? false
    };

    // Prefetch static data such as maps, queues, etc.
    this._seasons = await this._fetcher<Season[]>(constants.seasonsUrl);
    this._maps = await this._fetcher<GameMap[]>(constants.mapsUrl);
    this._gameModes = await this._fetcher<GameMode[]>(constants.gameModesUrl);
    this._gameTypes = await this._fetcher<GameType[]>(constants.gameTypesUrl);
    this._queues = await this._fetcher<Queue[]>(constants.queuesUrl);

    this._cache = config?.cache ?? new MemoryCache();
    this._logger = config?.logger ?? new ShieldbowLogger(config?.logLevel ?? 'WARN');

    // TODO: If selected, prefetch other data as well.
    if (typeof config?.prefetch === 'object' && config.prefetch.champions) {
      const champions = await this.champions.fetchAll();
      this.logger?.debug(`Prefetched ${champions.size} champions.`);
    }
  }

  /**
   * The default fetch options to be used by the client.
   */
  get defaultFetchOptions(): FetchConfig {
    return this._defaultFetchOptions;
  }

  get fetch(): <T>(url: string) => Promise<T> {
    return this._fetcher;
  }
}
