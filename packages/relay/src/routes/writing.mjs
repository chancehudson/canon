import { EpochKeyProof } from '@unirep/contracts'
import { ethers } from 'ethers'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { CANON_ADDRESS } from '../config.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

export default ({ app, db, synchronizer }) => {
  app.post('/api/section', createSection)
  app.get('/api/section', loadSections)

  // take the content along with a zk proof signing the content
  // and proving an epoch key
  async function createSection(req, res) {
    const { content, graffiti, publicSignals, proof } = req.body
    const epochKeyProof = new EpochKeyProof(publicSignals, proof, synchronizer.prover)
    const valid = await epochKeyProof.verify()
    if (!valid) {
      res.status(400).json({ error: 'Invalid proof' })
      return
    }

    // now verify the content against the data hash
    const contentHash = ethers.utils.solidityKeccak256(['string'], [content])
    const graffitiHash = ethers.utils.solidityKeccak256(['string'], [graffiti])
    const { epoch, epochKey } = epochKeyProof
    const hash = ethers.utils.solidityKeccak256(['uint', 'uint', 'uint', 'uint'], [contentHash, graffitiHash, epochKey, epoch])
    const mod = ethers.BigNumber.from(2).pow(200)
    const modded = ethers.BigNumber.from(hash).mod(mod)
    if (BigInt(modded.toString()) !== BigInt(epochKeyProof.data)) {
      res.status(400).json({ error: 'hash mismatch in data' })
      return
    }

    const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI)
    const calldata = canonContract.interface.encodeFunctionData(
      'submitSection',
      [contentHash, graffitiHash, epochKeyProof.publicSignals, epochKeyProof.proof]
    )

    const txHash = await TransactionManager.queueTransaction(
      CANON_ADDRESS,
      calldata
    )

    await db.create('Section', {
      content,
      graffiti,
      epoch: Number(BigInt(epoch)),
      hash: BigInt(hash).toString(),
      author: BigInt(epochKey).toString(),
      confirmed: 0,
      contentHash,
      graffitiHash,
    })
    res.json({ hash: txHash })
  }

  async function loadSections(req, res) {
    const epoch = await synchronizer.readCurrentEpoch()
    const canonicalSections = await db.findMany('Section', {
      where: {
        epoch: {
          lt: epoch.number
        },
        status: 1,
      }
    })
    const sections = await db.findMany('Section', {
      where: {
        epoch: epoch.number,
        status: 1,
      }
    })
    res.json({
      canonicalSections,
      items: sections,
    })
  }
}
