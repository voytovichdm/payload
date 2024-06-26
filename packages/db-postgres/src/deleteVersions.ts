import type { DeleteVersions } from 'payload/database'
import type { PayloadRequest, SanitizedCollectionConfig } from 'payload/types'

import { inArray } from 'drizzle-orm'
import { buildVersionCollectionFields } from 'payload/versions'

import type { PostgresAdapter } from './types'

import { findMany } from './find/findMany'
import { getTableName } from './schema/getTableName'

export const deleteVersions: DeleteVersions = async function deleteVersion(
  this: PostgresAdapter,
  { collection, locale, req = {} as PayloadRequest, where: where },
) {
  const db = this.sessions[req.transactionID]?.db || this.drizzle
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config

  const tableName = getTableName({
    adapter: this,
    config: collectionConfig,
    versions: true,
  })
  const fields = buildVersionCollectionFields(collectionConfig)

  const { docs } = await findMany({
    adapter: this,
    fields,
    limit: 0,
    locale,
    page: 1,
    pagination: false,
    req,
    tableName,
    where,
  })

  const ids = []

  docs.forEach((doc) => {
    ids.push(doc.id)
  })

  if (ids.length > 0) {
    await db.delete(this.tables[tableName]).where(inArray(this.tables[tableName].id, ids))
  }

  return docs
}
