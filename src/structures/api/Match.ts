import type { Client } from '../../client';
import type { GameMap, GameMode, GameType, MatchData, Queue, Region } from '../../types';
import { Collection } from '@discordjs/collection';
import { Team } from './Team';
import type { MatchTimeline } from './MatchTimeline';
import type { Champion, Item, RuneTree, SummonerSpell } from '../dragon';

/**
 * A representation of a league of legends match.
 */
export class Match {
  /**
   * The match ID.
   */
  readonly id: string;
  /**
   * The data version of the match.
   */
  readonly version: string;
  /**
   * The timestamp of creation of the match (before summoners spawn on the rift).
   */
  readonly createdTimestamp: number;
  /**
   * The timestamp of the beginning of the match (when summoners spawn on the rift).
   */
  readonly startTimestamp: number;
  /**
   * The duration of the match (in seconds).
   */
  readonly duration: number;
  /**
   * The timestamp of the end of the match.
   */
  readonly endTimestamp: number;
  /**
   * The ID of the game.
   */
  readonly gameId: number;
  /**
   * The game mode for the match.
   */
  readonly gameMode: GameMode;
  /**
   * The name of the match.
   */
  readonly gameName: string;
  /**
   * The type of game.
   */
  readonly gameType: GameType;
  /**
   * The version of the game.
   */
  readonly gameVersion: string;
  /**
   * The map on which the match was played.
   */
  readonly map: GameMap;
  /**
   * The region in which the match was played.
   *
   * Eg: `NA` or `EUW`.
   */
  readonly region: Region;
  /**
   * The queue type of the match.
   */
  readonly queue: Queue;
  /**
   * The tournament code of the match (if it is the part of a tournament).
   */
  readonly tournamentCode: string;
  /**
   * The 2 teams participating in the match.
   *
   * They are mapped by their map sides (`blue` and `red`).
   */
  readonly teams: Collection<'blue' | 'red', Team>;
  private readonly client: Client;

  /**
   * Creates a new match instance.
   * @param client - The client requesting the data.
   * @param data - The raw match data from the API.
   * @param champions - The champions involved in the match.
   * @param items - The items used in the match.
   * @param runeTrees - The rune trees in the game.
   * @param summonerSpells - The summoner spells in the game.
   */
  constructor(
    client: Client,
    data: MatchData,
    champions: Collection<string, Champion>,
    items: Collection<string, Item>,
    runeTrees: Collection<string, RuneTree>,
    summonerSpells: Collection<string, SummonerSpell>
  ) {
    if (this._isDataMalformed(data)) throw new Error('Match data received is malformed.');
    this.client = client;
    this.id = data.metadata.matchId;
    this.version = data.metadata.dataVersion;
    this.createdTimestamp = data.info.gameCreation;
    this.startTimestamp = data.info.gameStartTimestamp;
    this.duration = data.info.gameDuration;
    this.endTimestamp = data.info.gameEndTimestamp;
    this.gameId = data.info.gameId;
    this.gameMode = client.gameModes.find((m) => m.gameMode === data.info.gameMode)!;
    this.gameName = data.info.gameName;
    this.gameType = client.gameTypes.find((t) => t.gametype === data.info.gameType)!;
    this.gameVersion = data.info.gameVersion;
    this.map = client.maps.find((m) => m.mapId === data.info.mapId)!;
    this.region = this._regionFromPlatformId(data.info.platformId);
    this.queue = client.queues.find((q) => q.queueId === data.info.queueId)!;
    this.tournamentCode = data.info.tournamentCode;
    const blueTeamData = data.info.teams.find((t) => t.teamId === 100)!;
    const redTeamData = data.info.teams.find((t) => t.teamId === 200)!;
    const blueTeamParticipants = data.info.participants.filter((p) => p.teamId === 100);
    const redTeamParticipants = data.info.participants.filter((p) => p.teamId === 200);
    this.teams = new Collection<'blue' | 'red', Team>();
    this.teams.set('blue', new Team(blueTeamData, blueTeamParticipants, champions, items, runeTrees, summonerSpells));
    this.teams.set('red', new Team(redTeamData, redTeamParticipants, champions, items, runeTrees, summonerSpells));
  }

  /**
   * Fetch the timeline of the match.
   */
  fetchTimeline(): Promise<MatchTimeline> {
    return this.client.matches.fetchMatchTimeline(this.id, { region: this.region });
  }

  /**
   * Checks received match data for traits of a bugged match.
   * @param data - The raw match data from the API.
   */
  private _isDataMalformed(data: MatchData): boolean {
    if (data.info.gameCreation === 0) return true;
    if (data.info.gameDuration === 0) return true;
    if (data.info.gameMode.length === 0) return true;
    if (data.info.gameName.length === 0) return true;
    if (data.info.gameType.length === 0) return true;
    if (data.info.gameVersion.length === 0) return true;
    if (data.info.participants.length === 0) return true;
    return data.info.teams.length === 0;
  }

  private _regionFromPlatformId(platformId: string): Region {
    switch (platformId) {
      case 'BR1':
        return 'br';
      case 'EUN1':
        return 'eune';
      case 'EUW1':
        return 'euw';
      case 'JP1':
        return 'jp';
      case 'KR':
        return 'kr';
      case 'LA1':
        return 'lan';
      case 'LA2':
        return 'las';
      case 'OC1':
        return 'oce';
      case 'TR1':
        return 'tr';
      case 'RU':
        return 'ru';
      default:
        return 'na';
    }
  }
}
