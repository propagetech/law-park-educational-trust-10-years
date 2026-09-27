/**
 * Storage for the duties API: one DynamoDB table, items keyed by
 *   pk  what kind of record (MEMBER, ASSIGN, CUSTOM, EVENT, TODO, COMMENT, META, LOG)
 *   sk  its id within that kind
 * Every kind is small (hundreds of items at most), so each is one partition
 * read with a single Query.
 *
 * The same interface has an in-memory version for the local dev server, so
 * the handler's logic is exercised unchanged without AWS or Docker.
 */

export function dynamoStore(tableName) {
  let ready
  async function sdk() {
    if (!ready) {
      ready = Promise.all([import('@aws-sdk/client-dynamodb'), import('@aws-sdk/lib-dynamodb')]).then(([base, lib]) => ({
        lib,
        doc: lib.DynamoDBDocumentClient.from(new base.DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } }),
      }))
    }
    return ready
  }
  const failed = (err) => err?.name === 'ConditionalCheckFailedException'

  return {
    async get(pk, sk) {
      const { lib, doc } = await sdk()
      const res = await doc.send(new lib.GetCommand({ TableName: tableName, Key: { pk, sk } }))
      return res.Item ?? null
    },

    // ifAbsent: only if no item has this key. Returns false when the condition fails.
    async put(item, { ifAbsent = false } = {}) {
      const { lib, doc } = await sdk()
      try {
        await doc.send(
          new lib.PutCommand({
            TableName: tableName,
            Item: item,
            ...(ifAbsent ? { ConditionExpression: 'attribute_not_exists(sk)' } : {}),
          }),
        )
        return true
      } catch (err) {
        if (failed(err)) return false
        throw err
      }
    },

    // Sets fields (null removes one). ifLive: only an existing item that has
    // not been soft-removed. Returns false when the condition fails.
    async update(pk, sk, fields, { ifLive = false } = {}) {
      const { lib, doc } = await sdk()
      const set = []
      const remove = []
      const names = {}
      const values = {}
      Object.entries(fields).forEach(([k, v], i) => {
        names[`#f${i}`] = k
        if (v === null || v === undefined) remove.push(`#f${i}`)
        else {
          set.push(`#f${i} = :v${i}`)
          values[`:v${i}`] = v
        }
      })
      const expr = [set.length ? `SET ${set.join(', ')}` : '', remove.length ? `REMOVE ${remove.join(', ')}` : ''].filter(Boolean).join(' ')
      try {
        await doc.send(
          new lib.UpdateCommand({
            TableName: tableName,
            Key: { pk, sk },
            UpdateExpression: expr,
            ExpressionAttributeNames: { ...names, ...(ifLive ? { '#removed': 'removed_at' } : {}) },
            ...(Object.keys(values).length ? { ExpressionAttributeValues: values } : {}),
            ConditionExpression: ifLive ? 'attribute_exists(sk) AND attribute_not_exists(#removed)' : 'attribute_exists(sk)',
          }),
        )
        return true
      } catch (err) {
        if (failed(err)) return false
        throw err
      }
    },

    async del(pk, sk) {
      const { lib, doc } = await sdk()
      await doc.send(new lib.DeleteCommand({ TableName: tableName, Key: { pk, sk } }))
    },

    // All items of one kind in sk order; reverse + limit for "newest n".
    async query(pk, { reverse = false, limit } = {}) {
      const { lib, doc } = await sdk()
      const items = []
      let ExclusiveStartKey
      do {
        const res = await doc.send(
          new lib.QueryCommand({
            TableName: tableName,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: { ':pk': pk },
            ScanIndexForward: !reverse,
            ExclusiveStartKey,
            ...(limit ? { Limit: limit - items.length } : {}),
          }),
        )
        items.push(...(res.Items ?? []))
        ExclusiveStartKey = res.LastEvaluatedKey
      } while (ExclusiveStartKey && (!limit || items.length < limit))
      return items
    },

    async count(pk) {
      const { lib, doc } = await sdk()
      let total = 0
      let ExclusiveStartKey
      do {
        const res = await doc.send(
          new lib.QueryCommand({
            TableName: tableName,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: { ':pk': pk },
            Select: 'COUNT',
            ExclusiveStartKey,
          }),
        )
        total += res.Count ?? 0
        ExclusiveStartKey = res.LastEvaluatedKey
      } while (ExclusiveStartKey)
      return total
    },
  }
}

export function memoryStore() {
  const kinds = new Map()
  const kind = (pk) => kinds.get(pk) ?? kinds.set(pk, new Map()).get(pk)
  const copy = (item) => (item ? structuredClone(item) : null)

  return {
    async get(pk, sk) {
      return copy(kind(pk).get(sk))
    },
    async put(item, { ifAbsent = false } = {}) {
      if (ifAbsent && kind(item.pk).has(item.sk)) return false
      kind(item.pk).set(item.sk, copy(item))
      return true
    },
    async update(pk, sk, fields, { ifLive = false } = {}) {
      const item = kind(pk).get(sk)
      if (!item || (ifLive && item.removed_at)) return false
      for (const [k, v] of Object.entries(fields)) {
        if (v === null || v === undefined) delete item[k]
        else item[k] = v
      }
      return true
    },
    async del(pk, sk) {
      kind(pk).delete(sk)
    },
    async query(pk, { reverse = false, limit } = {}) {
      const items = [...kind(pk).values()].sort((a, b) => (a.sk < b.sk ? -1 : a.sk > b.sk ? 1 : 0))
      if (reverse) items.reverse()
      return (limit ? items.slice(0, limit) : items).map(copy)
    },
    async count(pk) {
      return kind(pk).size
    },
  }
}
