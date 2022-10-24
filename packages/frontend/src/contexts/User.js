import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'
import { ZkIdentity, Strategy } from '@unirep/crypto'
import { UserState, schema } from '@unirep/core'
import { IndexedDBConnector } from 'anondb/web'
import { provider, UNIREP_ADDRESS, CANON_ADDRESS, SERVER } from '../config'
import prover from './prover'

class User {

  hasSignedUp = false

  constructor() {
    makeAutoObservable(this)
    this.load()
  }

  async load() {
    const id = localStorage.getItem('id')
    const identity = new ZkIdentity(id ? Strategy.SERIALIZED : Strategy.RANDOM, id)
    if (!id) {
      localStorage.setItem('id', identity.serializeIdentity())
    }
    const db = await IndexedDBConnector.create(schema, 1)
    const userState = new UserState({
      db,
      provider,
      prover,
      unirepAddress: UNIREP_ADDRESS,
      attesterId: CANON_ADDRESS,
      _id: identity,
    })
    await userState.start()
    await userState.waitForSync()
    this.hasSignedUp = await userState.hasSignedUp()
    this.userState = userState
  }

  async signup(message) {
    const signupProof = await this.userState.genUserSignUpProof()
    const data = await fetch(`${SERVER}/api/signup`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        publicSignals: signupProof.publicSignals,
        proof: signupProof.proof,
      })
    }).then(r => r.json())
    await provider.waitForTransaction(data.hash)
    await this.userState.waitForSync()
    this.hasSignedUp = await this.userState.hasSignedUp()
  }
}

export default createContext(new User())
