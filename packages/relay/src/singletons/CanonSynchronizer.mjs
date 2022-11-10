import { Synchronizer } from '@unirep/core'
import { ethers } from 'ethers'
import { provider, UNIREP_ADDRESS, CANON_ADDRESS, PRIVATE_KEY, DB_PATH } from '../config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import prover from './prover.mjs'
import schema from './schema.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI, provider)

class CanonSynchronizer extends Synchronizer {

  get contracts() {
    return {
      ...super.contracts,
      [canonContract.address]: {
        contract: canonContract,
        eventNames: [
          'SectionSubmitted',
          'SectionVote',
          'CanonFire',
        ]
      }
    }
  }
/**
 * event handlers
 **/

  async handleSectionSubmitted({ event, db, decodedData }) {
    const epochKey = BigInt(event.topics[1]).toString()
    const epoch = BigInt(event.topics[2])
    const contentHash = BigInt(event.topics[3]).toString()
    const graffitiHash = BigInt(decodedData.graffitiHash).toString()
    db.update('Section', {
      where: {
        contentHash,
        graffitiHash,
        epoch: Number(epoch),
        author: epochKey,
      },
      update: {
        confirmed: 1,
      }
    })
  }

  async handleSectionVote({ event, db }) {
    const epochKey = BigInt(event.topics[1]).toString()
    const sectionId = BigInt(event.topics[2]).toString()
    const voteCount = Number(BigInt(event.topics[3]))
    db.update('Section', {
      where: {
        id: sectionId,
      },
      update: {
        voteCount,
      }
    })
  }

  async handleCanonFire({ event, db }) {
    const epoch = Number(BigInt(event.topics[1]))
    const sectionId = BigInt(event.topics[2]).toString()
    const voteCount = Number(BigInt(event.topics[3]))
    db.upsert('Canon', {
      where: {
        epoch,
      },
      update: {
        sectionId,
        voteCount
      },
      create: {
        epoch,
        sectionId,
        voteCount,
      }
    })
  }
}

const db = await SQLiteConnector.create(schema, DB_PATH ?? ':memory:')
export default new CanonSynchronizer({
  db,
  provider,
  unirepAddress: UNIREP_ADDRESS,
  attesterId: CANON_ADDRESS,
  prover,
})
