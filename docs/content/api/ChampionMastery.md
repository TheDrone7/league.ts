---
title: ChampionMastery
description: A representation of a summoner's mastery over a champion.
---

# ChampionMastery class

---

A representation of a summoner's mastery over a champion.

**Signature:**

```ts
export declare class ChampionMastery 
```

---

### Constructor

```ts
new ChampionMastery (data: ChampionMasteryData, champion: Champion)
```

Constructs a new instance of the `ChampionMastery` class.

**Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| data | [ChampionMasteryData](/api/championmasterydata) | The raw champion mastery data from the API. |
| champion | [Champion](/api/champion) | The champion these details are for. |
---

### Properties

#### champion

The champion these details are for.



**Type**: [Champion](/api/champion)

---

#### chestGranted

Whether the summoner has earned the chest for this champion this season.



**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

---

#### lastPlayedAt

The time this summoner played the champion last time.



**Type**: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

---

#### level

The mastery level, can be anywhere between 1 and 7.



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### points

The total number of mastery points earned by this summoner on the champion.



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### pointsSinceLastLevel

The number of mastery points earned by the summoner since they progressed from the previous level.



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### pointsToNextLevel

The number of mastery points required by the summoner to achieve the next level.



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### tokens

This is only applicable if the mastery level is 5 or 6. The number of tokens achieved for reaching the next mastery level.



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

