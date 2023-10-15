import { Client } from 'client';

/**
 * Represents a Stat Rune in League of Legends.
 */
export class StatRune {
  /**
   * The name of the stat rune.
   */
  readonly name: string;
  /**
   * The ID of the stat rune.
   */
  readonly id: number;
  /**
   * The icon of the stat rune.
   */
  readonly icon: string;
  /**
   * The description of the stat rune.
   */
  readonly description: string;

  constructor(client: Client, name: string, id: number, icon: string, description: string) {
    this.name = name;
    this.id = id;
    this.icon = client.generateUrl(icon, 'dDragon', true);
    this.description = description;
  }
}
