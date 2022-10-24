import url from 'url'
import path from 'path'
import express from 'express'
import { provider, UNIREP_ADDRESS, CANON_ADDRESS, PRIVATE_KEY } from './config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import { Synchronizer } from '@unirep/core'
import { defaultProver } from '@unirep/circuits/provers/defaultProver.js'
import schema from './schema.mjs'
import TransactionManager from './singletons/TransactionManager.mjs'
import WritingRoutes from './routes/writing.mjs'
import SignupRoutes from './routes/signup.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const db = await SQLiteConnector.create(schema, ':memory:')
const synchronizer = new Synchronizer({
  db,
  provider,
  unirepAddress: UNIREP_ADDRESS,
  attesterId: CANON_ADDRESS, // need to update this
  prover: defaultProver,
})

await synchronizer.start()

TransactionManager.configure(PRIVATE_KEY, provider, db)
await TransactionManager.start()

const app = express()
const port = process.env.PORT ?? 8000
app.listen(port, () => console.log(`Listening on port ${port}`))
app.use('*', (req, res, next) => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-headers', '*')
  next()
})
app.use(express.json())
app.use('/build', express.static(path.join(__dirname, '../keys')))

WritingRoutes({ app, db, synchronizer })
SignupRoutes({ app, db, synchronizer })
