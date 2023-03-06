---
title: MatchData
description: The match data as returned by the API.
---

## MatchData interface

The match data as returned by the API.

**Signature:**

```ts
export interface MatchData 
```

### Properties

#### info



**Type**: {         gameCreation: number;         gameDuration: number;         gameEndTimestamp: number;         gameId: number;         gameMode: string;         gameName: string;         gameStartTimestamp: number;         gameType: string;         gameVersion: string;         mapId: number;         participants: ParticipantData[];         platformId: string;         queueId: number;         teams: TeamData[];         tournamentCode: string;     }

---

#### metadata



**Type**: {         dataVersion: string;         matchId: string;         participants: string[];     }

---

