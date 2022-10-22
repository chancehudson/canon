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

}
