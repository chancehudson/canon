import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'
import { ZkIdentity, Strategy } from '@unirep/crypto'
import { UserState, schema } from '@unirep/core'
import { IndexedDBConnector } from 'anondb/web'
import { provider, UNIREP_ADDRESS } from '../config'
import { defaultProver } from '@unirep/circuits/provers/defaultProver'

class User {
  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    const id = localStorage.get('id')
    const identity = new ZkIdentity(id ? Strategy.SERIALIZED : Strategy.RANDOM, id)
    if (!id) {
      localStorage.set('id', identity.serializeIdentity())
    }
    const db = IndexedDBConnector.create(schema, 1)
    const userState = new UserState({
      db,
      provider,
      prover: defaultProver,
      unirepAddress: UNIREP_ADDRESS,
      attesterId: '0xfuck',
      _id: identity,
    })
    await userState.start()
    await userState.waitForSync()
    if (!(await userState.hasSignedUp())) {
      const signupProof = await userState.genSignupProof()
      const data = await fetch({
        url: `${SERVER}/api/signup`
      })
    }
  }
}

export default createContext(new User())
