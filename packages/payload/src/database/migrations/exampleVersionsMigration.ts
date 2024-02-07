import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload/types'

import { sql } from 'drizzle-orm'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const allDocs = await payload.db.find({
    collection: 'pages',
    req: req as PayloadRequest,
  })

  // TODO: Batching
  for (const doc of allDocs.docs) {
    const updated = await payload.update({
      id: doc.id,
      collection: 'pages',
      // @ts-expect-error Typing not available from config
      data: doc,
    })
    console.log('Updated', { updated })
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Migration code
}
