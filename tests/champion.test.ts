import { Champion, Client } from '../dist';

describe('DRAGON: champions', () => {
  const client = new Client(process.env.RIOT_API_KEY!);

  let kayn: Champion;

  beforeAll(async () => {
    await client.initialize(global.clientConfig);
    try {
      kayn = await client.champions.fetch('Kayn', { ignoreCache: true, cache: true });
    } catch (e) {
      client.logger?.error(e);
    }
  });

  it('can fetch a champion by ID', () => {
    expect(kayn.name).toBe('Kayn');
  });

  it('can fetch champion by name and key (cached)', async () => {
    const byName = await client.champions.fetchByName('Kayn');
    const byKey = await client.champions.fetchByKey(kayn.key);

    expect(byName).toBe(kayn);
    expect(byKey).toBe(kayn);
  });

  it('can fetch champion by name and key (forced)', async () => {
    // Storage is disabled in the client config anyway, so no need to ignore that manually.
    const byName = await client.champions.fetchByName("kai'sa", { ignoreCache: true, cache: true });
    const byKey = await client.champions.fetchByKey(523, { ignoreCache: true, cache: true });

    expect(byName?.name).toBe("Kai'Sa");
    expect(byKey?.name).toBe('Aphelios');
  });

  it('can fetch all champions', async () => {
    // Storage is disabled in the client config anyway, so no need to ignore that manually.
    const champions = await client.champions.fetchAll({ ignoreCache: true });
    expect(champions.size).toBeGreaterThan(150);
  }, 300000);

  it('assigns champion spells correctly', () => {
    expect(kayn.spells.has('Q')).toBeTruthy();
    expect(kayn.spells.get('Q')!.name).toBe('Reaping Slash');

    expect(kayn.spells.has('W')).toBeTruthy();
    expect(kayn.spells.get('W')!.name).toBe("Blade's Reach");

    expect(kayn.spells.has('E')).toBeTruthy();
    expect(kayn.spells.get('E')!.name).toBe('Shadow Step');

    expect(kayn.spells.has('R')).toBeTruthy();
    expect(kayn.spells.get('R')!.name).toBe('Umbral Trespass');
  });

  it('contains champion passive', () => {
    expect(kayn.passive.name).toBe('The Darkin Scythe');
  });

  it('contains champion classes', () => {
    expect(kayn.classes).toContain('Assassin');
    expect(kayn.classes).toContain('Fighter');
  });

  it('can fetch champion assets', () => {
    expect(kayn.defaultSplashArt).toBe(
      'http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/uncentered/141/141000.jpg'
    );
    expect(kayn.defaultLoadingScreen).toBe(
      'https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/kayn/skins/base/kaynloadscreen.jpg'
    );
  });

  it('can cache champions', async () => {
    expect((await client.cache.get<Champion>('champion:Kayn'))?.name).toBe('Kayn');
  });

  it('can fetch champion sprites', () => {
    expect(kayn.sprite.size.w).toBe(48);
    expect(kayn.sprite.size.h).toBe(48);

    expect(typeof kayn.sprite.image).toBe('string');
  });
});
