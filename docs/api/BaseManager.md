---
title: BaseManager
description: A base for any manager classes.
---

## BaseManager interface

A base for any manager classes.

**Signature:**

```ts
export interface BaseManager<T> 
```

### Properties

#### client

The client this manager is being used by.



**Type**: [Client](/api/Client.md)

---

### Methods

#### .fetch ()

The method to actually fetch the data.




**Signature:**

```ts
fetch(id: any, options: {
        force: boolean;
    }): Promise<T>;
```

**Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| id | any | The ID of the data entity being fetched. |
| options | {         force: boolean;     } | Basic fetch options, setting the force option to `true` must ignore the cache. |

**Return type**: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) \< T \>

---

