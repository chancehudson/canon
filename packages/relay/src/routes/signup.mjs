import { SignupProof } from '@unirep/contracts'
import { ethers } from 'ethers'
import { CANON_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

/**
 * Automatically add an identity commitment to the group
 * TODO: make users write a proposal to join, which is voted on once an epoch
 * Users in the vote queue are admitted when they receive the most votes of
 * all competitors. No quarum required. Users can optionally delegate votes.
 **/

export default ({ app, db, synchronizer }) => {
  app.post('/api/signup', async (req, res) => {

    const { publicSignals, proof } = req.body
    const signupProof = new SignupProof(publicSignals, proof, synchronizer.prover)
    const valid = await signupProof.verify()
    if (!valid) {
      res.status(400).json({ error: 'Invalid proof' })
      return
    }
    const currentEpoch = synchronizer.calcCurrentEpoch()
    if (currentEpoch !== Number(BigInt(signupProof.epoch))) {
      res.status(400).json({ error: 'Wrong epoch' })
      return
    }
    // make a transaction lil bish
    const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI)
    // const contract =
    const calldata = canonContract.interface.encodeFunctionData(
      'signup',
      [signupProof.publicSignals, signupProof.proof]
    )
    const hash = await TransactionManager.queueTransaction(
      CANON_ADDRESS,
      {
        data: calldata,
        gasLimit: 2000000,
      },
    )
    res.json({ hash })

  })
}
