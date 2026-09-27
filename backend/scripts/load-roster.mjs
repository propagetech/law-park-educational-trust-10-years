// Loads the team roster into the live table. The roster is people's mobile
// numbers, so it is NOT in this public repo: it lives in team-roster.json at
// the repo root (git-ignored), as [{ "name": "...", "mobile": "+91..." }].
//   npm run load-roster                      # table lawpark-event-duties, ap-south-1
// Safe to run again: a number already there keeps the name its owner chose.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const table = process.env.TABLE_NAME || 'lawpark-event-duties'
const region = process.env.AWS_REGION || 'ap-south-1'
const file = process.argv[2] || fileURLToPath(new URL('../../team-roster.json', import.meta.url))
const people = JSON.parse(readFileSync(file, 'utf8'))
const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }))
const at = new Date().toISOString()
let added = 0
let kept = 0
for (const { name, mobile } of people) {
  if (!/^\+[1-9]\d{7,14}$/.test(mobile) || !name) throw new Error(`Bad roster line: ${JSON.stringify({ name, mobile })}`)
  try {
    await doc.send(
      new PutCommand({
        TableName: table,
        Item: { pk: 'MEMBER', sk: mobile, name, first_seen: at, last_seen: '' },
        ConditionExpression: 'attribute_not_exists(sk)',
      }),
    )
    added++
  } catch (err) {
    if (err.name !== 'ConditionalCheckFailedException') throw err
    kept++
  }
}
console.log(`${table}: ${added} added, ${kept} already there`)
