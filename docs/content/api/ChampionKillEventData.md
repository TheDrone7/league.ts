---
title: ChampionKillEventData
description: The event data for the champion kill event.
---

## ChampionKillEventData interface

The event data for the champion kill event.

**Signature:**

```ts
export interface ChampionKillEventData extends TimelineEventData 
```

**References:** [TimelineEventData](/api/timelineeventdata)

### Properties

#### assistingParticipantIds



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)[]

---

#### bountyLevel



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### killerId



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### killStreakLength



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### position



**Type**: [PositionData](/api/positiondata)

---

#### shutdownBounty



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

#### type



**Type**: 'CHAMPION_KILL'

---

#### victimDamageDealt



**Type**: [DamageDealtData](/api/damagedealtdata)[]

---

#### victimDamageReceived



**Type**: [DamageDealtData](/api/damagedealtdata)[]

---

#### victimId



**Type**: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

---

