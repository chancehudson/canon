import { EpochKeyProof } from '@unirep/circuits'
import { ethers } from 'ethers'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { CANON_ADDRESS } from '../config.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

export default ({ app, db, synchronizer }) => {
  app.post('/api/vote', async (req, res) => {

    try {
      const { publicSignals, proof } = req.body
      const epochKeyProof = new EpochKeyProof(publicSignals, proof, synchronizer.prover)
      const valid = await epochKeyProof.verify()
      if (!valid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }

      const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI)
      const calldata = canonContract.interface.encodeFunctionData(
        'voteSection',
        [epochKeyProof.publicSignals, epochKeyProof.proof]
      )
      const hash = await TransactionManager.queueTransaction(
        CANON_ADDRESS,
        calldata
      )
      res.json({ hash })
    } catch (error) {
      res.status(500).json({ error })
    }

  })
}
