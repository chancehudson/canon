import { EpochKeyProof } from '@unirep/contracts'

export default ({ app, db, synchronizer }) => {
  app.post('/api/section', createSection)

  // take the content along with a zk proof signing the content
  // and proving an epoch key
  async function createSection(req, res) {
    const { content, graffiti, publicSignals, proof } = req.body
    await db.create('Section', {
      content,
      graffiti,
      hash: '', // TODO: keccak
      author: '', // TODO: get from zk proof
    })
  }

  async function relay(req, res) {
    const { data, to } = req.body
    // we queue it and give a transaction hash
    if (typeof data !== 'string') {
      res.status(400).json({ error: 'transaction data must be a string' })
      return
    }
    try {
      const hash = await TransactionManager.queueTransaction(to, data)
      res.json({ hash })
    } catch (err) {
      res.status(400).json({ error: 'transaction estimation failed' })
    }
  }

}
