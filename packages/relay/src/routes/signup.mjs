import { SignupProof } from '@unirep/circuits'
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

    try {
      const { publicSignals, proof } = req.body
      const signupProof = new SignupProof(publicSignals, proof, synchronizer.prover)
      console.log('signupProof', signupProof);
      const valid = await signupProof.verify()
      console.log('valid proof');
      if (!valid) {
        console.log('/api/signup[400]: invalid signup proof');
        res.status(400).json({ error: 'Invalid proof' })
        return
      }
      console.log('getting epoch...')
      const currentEpoch = synchronizer.calcCurrentEpoch()
      console.log('got epoch', currentEpoch)
      if (currentEpoch !== Number(BigInt(signupProof.epoch))) {
        console.log('/api/signup[400]: invalid signup epoch');
        res.status(400).json({ error: 'Wrong epoch' })
        return
      }
      console.log('making tx')
      // make a transaction lil bish
      const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI)
      console.log('contract', canonContract)
      // const contract =
      const calldata = canonContract.interface.encodeFunctionData(
        'signup',
        [signupProof.publicSignals, signupProof.proof]
      )
      console.log('calldata: ', calldata);
      const hash = await TransactionManager.queueTransaction(
        CANON_ADDRESS,
        calldata,
      )
      console.log('hash:', hash);

      res.json({ hash })

    } catch (error) {
      console.log('error: ', error)
      res.status(500).json({ error })
    }

  })
}
