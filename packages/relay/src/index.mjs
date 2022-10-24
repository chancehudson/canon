import url from 'url'
import path from 'path'
import express from 'express'
import { provider, PRIVATE_KEY } from './config.mjs'
import TransactionManager from './singletons/TransactionManager.mjs'
import WritingRoutes from './routes/writing.mjs'
import SignupRoutes from './routes/signup.mjs'
import synchronizer from './singletons/CanonSynchronizer.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

await synchronizer.start()

TransactionManager.configure(PRIVATE_KEY, provider, synchronizer._db)
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

WritingRoutes({ app, db: synchronizer._db, synchronizer })
SignupRoutes({ app, db: synchronizer._db, synchronizer })
