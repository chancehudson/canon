import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'
import { ZkIdentity, Strategy } from '@unirep/utils'
import { UserState, schema } from '@unirep/core'
import { IndexedDBConnector, MemoryConnector } from 'anondb/web'
import { constructSchema } from 'anondb/types'
import { ethers } from 'ethers'
import { provider, UNIREP_ADDRESS, CANON_ADDRESS, SERVER } from '../config'
import prover from './prover'

// TODO: don't do this
import { canon } from './canon'

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

    const db = new MemoryConnector(constructSchema(schema))
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
    this.watchTransition()
  }

  async watchTransition() {
    for (;;) {
      const epoch = await this.userState.latestTransitionedEpoch()
      const hasSignedUp = await this.userState.hasSignedUp()
      try {
        if (hasSignedUp && epoch != this.userState.calcCurrentEpoch()) {
          await this.stateTransition()
        }
      } catch (err) {
        await new Promise(r => setTimeout(r, 10000))
        continue
      }
      const time = this.userState.calcEpochRemainingTime()
      await new Promise(r => setTimeout(r, time * 1000))
    }
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

  async submitSection(content, graffiti = '') {
    const contentHash = ethers.utils.solidityKeccak256(['string'], [content])
    const graffitiHash = ethers.utils.solidityKeccak256(['string'], [graffiti])
    const epoch = this.userState.calcCurrentEpoch()
    const epochKeys = await this.userState.getEpochKeys(epoch)
    const epochKey = epochKeys[0]
    const hash = ethers.utils.solidityKeccak256(['uint', 'uint', 'uint', 'uint'], [contentHash, graffitiHash, epochKey, epoch])
    const mod = ethers.BigNumber.from(2).pow(200)
    const modded = ethers.BigNumber.from(hash).mod(mod)
    const epochKeyProof = await this.userState.genEpochKeyProof({
      data: modded.toString(),
      epoch,
      nonce: 0,
    })
    const data = await fetch(`${SERVER}/api/section`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        publicSignals: epochKeyProof.publicSignals,
        proof: epochKeyProof.proof,
        content,
        graffiti,
      })
    }).then(r => r.json())
    await provider.waitForTransaction(data.hash)
    await this.userState.waitForSync()
    await canon.loadSections()
  }

  async voteSection(id) {
    const epoch = this.userState.calcCurrentEpoch()
    const epochKeyProof = await this.userState.genEpochKeyProof({
      data: id.toString(),
      epoch,
      nonce: 0,
    })
    const data = await fetch(`${SERVER}/api/vote`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        publicSignals: epochKeyProof.publicSignals,
        proof: epochKeyProof.proof,
      })
    }).then(r => r.json())
    await provider.waitForTransaction(data.hash)
    await this.userState.waitForSync()
    await canon.loadSections()
  }

  async stateTransition() {
    const signupProof = await this.userState.genUserStateTransitionProof()
    const data = await fetch(`${SERVER}/api/transition`, {
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
    await canon.loadCanon()
  }
}

export default createContext(new User())
