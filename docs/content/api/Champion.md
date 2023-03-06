---
title: Champion
description: A representation of a League of Legends champion.
---

# Champion class

---

A representation of a League of Legends champion.

**Signature:**

```ts
export declare class Champion 
```

---

### Constructor

```ts
new Champion (client: Client, data: ChampionData, damage: SpellDamageData, meraki: MerakiChampion)
```

Constructs a new instance of the `Champion` class.

**Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| client | [Client](/api/client) | The client creating this instance. |
| data | [ChampionData](/api/championdata) | The raw champion data from data dragon. |
| damage | [SpellDamageData](/api/spelldamagedata) | The raw champion data from community dragon |
| meraki | [MerakiChampion](/api/merakichampion) | The raw champion data from meraki analytics |
---

### Properties

#### allyTips

An array of tips to play as/along this champion.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]

---

#### attackType

The type of this champion's basic attacks - RANGED or MELEE.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### blurb

A shortened version of the champion's lore.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### classes

The champion classes this champion belongs to, such as - Fighter, Tank, Assassin, etc.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]

---

#### defaultLoadingScreen

The champion's default skin loading screen art.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### defaultSplashArt

The champion's default skin splash art.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### enemyTips

An array of tips to play against this champion.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]

---

#### icon

A URL to the champion's icon.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### id

The ID of the champion. To get the ID, in the champion's name


- Capitalize the words


- Remove any spaces and special characters


- The words after a `'` - such as in Kai'sa, remain lowercase.


Examples:


- Kayn -\> Kayn


- Cho'Gath -\> Chogath


- Dr. Mundo -\> DrMundo


There are 2 exceptions to this rule.


1. Wukong -\> MonkeyKing


2. Renata Glasc -\> Renata



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### key

The key - a 3-digit number, that is used to identify the champion.



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### lore

The complete lore of the champion.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### name

The name of the champion.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### passive

The champion's passive ability summarized.



**Type**: [ChampionPassive](/api/championpassive)

---

#### pricing

The in-game pricing of the champion.



**Type**: [ChampionPricing](/api/championpricing)

---

#### ratings

The champion's magic, defense, attack, difficulty ratings.



**Type**: [ChampionRating](/api/championrating)

---

#### releaseDate

The date this champion was released on.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### releasePatch

The patch this champion was introduced to the live servers.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### resource

The resource represented by the bar below this champion's health bar in game.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

#### skins

A collection of the available skins for this champion. The default skin always has the id - `0`.



**Type**: [Collection](https://discord.js.org/#/docs/collection/stable/class/Collection) \< [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), [ChampionSkin](/api/championskin) \>

---

#### spells

The champion's spells (abilities), mapped by the key they are assigned to, by default - Q, W, E, R, respectively.



**Type**: [Collection](https://discord.js.org/#/docs/collection/stable/class/Collection) \< 'Q' \| 'W' \| 'E' \| 'R', [ChampionSpell](/api/championspell) \>

---

#### sprite

The sprite information of the champion.



**Type**: [ChampionSprite](/api/championsprite)

---

#### stats

A collection of the champion's base stats.



**Type**: [Collection](https://discord.js.org/#/docs/collection/stable/class/Collection) \< [Stats](/api/stats), [ChampionStat](/api/championstat) \>

---

#### title

A title given to the champion based on their lore.



**Type**: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

---

