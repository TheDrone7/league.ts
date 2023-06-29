import { Client, ChampionMasteryManager } from '../dist';

describe('API: champion-mastery-v4', () => {
  const client = new Client(process.env.RIOT_API_KEY!);

  let masteries: ChampionMasteryManager;

  beforeAll(async () => {
    await client.initialize(global.clientConfig);
    const summoner = await client.summoners.fetchBySummonerName('TheDrone7');
    masteries = summoner.championMastery;
  });

  it('can fetch mastery details for specific champion', async () => {
    const mastery = await masteries.fetch('Kayn');
    expect(mastery.level).toBe(7);
  });

  it('can fetch all champion mastery', async () => {
    const summonerMastery = await masteries.fetchAll({
      ignoreCache: true,
      ignoreStorage: true
    });
    expect(summonerMastery.size).toBeGreaterThan(50);
  }, 300000);

  it('can fetch highest mastery', async () => {
    const mastery = await masteries.highest(0, {
      ignoreCache: true,
      ignoreStorage: true
    });
    expect(mastery.level).toBe(7);
  });

  it('can fetch highest mastery from cache', async () => {
    const mastery = await masteries.highest(0, {
      ignoreCache: false,
      ignoreStorage: true
    });
    expect(mastery.level).toBe(7);
  });

  it('can fetch n highest masteries', async () => {
    const fetched = await masteries.fetchTop(10, {
      ignoreCache: true,
      ignoreStorage: true
    });
    expect(fetched.length).toBe(10);
    expect(fetched[0].level).toBe(7);
    expect(fetched[0].champion.name).toBe('Kayn');
  });

  it('can fetch n highest masteries from cache', async () => {
    const fetched = await masteries.fetchTop(10, {
      ignoreCache: false,
      ignoreStorage: true
    });
    expect(fetched.length).toBe(10);
    expect(fetched[0].level).toBe(7);
    expect(fetched[0].champion.name).toBe('Kayn');
  });

  it('can fetch total points', async () => {
    await masteries.updateTotalScore();
    const points = masteries.totalScore;
    expect(points).toBeGreaterThan(296);
  });
});
