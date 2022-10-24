import { SignupProof } from '@unirep/contracts'
import { ethers } from 'ethers'
import { CANON_ADDRESS, provider } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

export default ({ app, db, synchronizer }) => {
  app.post('/api/signup', signup)

  // take the content along with a zk proof signing the content
  // and proving an epoch key
  async function signup(req, res) {
    const { publicSignals, proof } = req.body
    const signupProof = new SignupProof(publicSignals, proof, synchronizer.prover)
    const valid = await signupProof.verify()
    if (!valid) {
      res.status(400).json({ error: 'Invalid proof' })
      return
    }
    // make a transaction lil bish
    const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI, provider)
    // const contract =
    const calldata = canonContract.interface.encodeFunctionData(
      'signup',
      [publicSignals, proof]
    )
    const hash = await TransactionManager.queueTransaction(
      CANON_ADDRESS,
      calldata,
    )
    res.json({hash})
  }

}
