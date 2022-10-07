import { Client, Tournament } from '../dist';

describe('Test Clash v1 API', () => {
  const client = new Client(process.env.RIOT_API_KEY!);

  let tournaments: Tournament[];

  beforeAll(async () => {
    await client.initialize({
      region: 'na',
      cache: false
    });
    tournaments = await client.clash.fetchAll();
  });

  test('Check fetching all tournaments', () => {
    expect(tournaments).toBeDefined();
  });

  test('Check fetching tournament by ID', async () => {
    if (tournaments.length) {
      const t = await client.clash.fetch(tournaments[0].id);
      const t2 = await client.clash.fetch(tournaments[0].id, { force: true });
      expect(t.title).toBe(tournaments[0].title);
      expect(t2.title).toBe(tournaments[0].title);
    }
  });
});
