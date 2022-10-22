import { SignupProof } from '@unirep/contracts'
import TransactionManager from '../singletons/TransactionManager'

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
    
  }

}
