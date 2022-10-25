import { EpochKeyProof } from '@unirep/contracts'
import { ethers } from 'ethers'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { CANON_ADDRESS } from '../config.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

/**
 * Create a section
 * Calculate the id by hashing the content+graffiti % 2^200 (to fit in a snark field).
 * Mark confirmed: 0 until the blockchain confirms the tx (see CanonSychronizer)
 **/

export default ({ app, db, synchronizer }) => {
  app.post('/api/section', async (req, res) => {

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
      id: BigInt(modded).toString(),
      author: BigInt(epochKey).toString(),
      confirmed: 0,
      contentHash: BigInt(contentHash).toString(),
      graffitiHash: BigInt(graffitiHash).toString(),
    })
    res.json({ hash: txHash })

  })
}
