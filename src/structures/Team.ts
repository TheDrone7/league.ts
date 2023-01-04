import type { Client } from '../client';
import type { ParticipantData, TeamData, TeamObjectivesData } from '../types';
import type { Champion } from './Champion';
import { Participant } from './Participant';
import type { Collection } from '@discordjs/collection';
import type { Item } from './Item';
import type { RuneTree } from './RuneTree';

/**
 * A banned champion in a match.
 */
export interface ChampionBan {
  /**
   * The numerical order in which the champion was banned.
   */
  order: number;
  /**
   * The banned champion.
   */
  champion: Champion;
}

/**
 * A representation of a team in a match.
 */
export class Team {
  /**
   * The ID of the team.
   */
  readonly id: number;
  /**
   * The champions banned by the team.
   */
  readonly bans: ChampionBan[];
  /**
   * The objectives secured by the team.
   */
  readonly objectives: TeamObjectivesData;
  /**
   * Whether the team won the match.
   */
  readonly win: boolean;
  /**
   * The participants in the team.
   */
  readonly participants: Participant[];
  constructor(
    client: Client,
    data: TeamData,
    participants: ParticipantData[],
    champions: Collection<string, Champion>,
    items: Collection<string, Item>,
    runeTrees: Collection<string, RuneTree>
  ) {
    this.id = data.teamId;
    this.bans = data.bans.map((b) => ({
      order: b.pickTurn,
      champion: champions.find((c) => c.key === b.championId)!
    }));
    this.objectives = data.objectives;
    this.participants = participants.map(
      (p) => new Participant(client, p, champions.find((c) => c.key === p.championId)!, items, runeTrees)
    );
    this.win = data.win;
  }
}
