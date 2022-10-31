import { Synchronizer } from '@unirep/core'
import { ethers } from 'ethers'
import { provider, UNIREP_ADDRESS, CANON_ADDRESS, PRIVATE_KEY, DB_PATH } from '../config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import prover from './prover.mjs'
import schema from './schema.mjs'
import CanonABI from '@canon/contracts/abi/Canon.json' assert { type: 'json' }

const canonContract = new ethers.Contract(CANON_ADDRESS, CanonABI, provider)

class CanonSynchronizer extends Synchronizer {
  async loadNewEvents(fromBlock, toBlock) {
    const p1 = super.loadNewEvents(fromBlock, toBlock)
    const p2 = canonContract.queryFilter(
        this.canonFilter,
        fromBlock,
        toBlock
    )
    return (await Promise.all([p1, p2])).flat()
  }

  get canonFilter() {
    const [SectionSubmitted] = canonContract.filters.SectionSubmitted().topics
    const [SectionVote] = canonContract.filters.SectionVote().topics
    const [CanonFire] = canonContract.filters.CanonFire().topics
    return {
        address: CANON_ADDRESS,
        topics: [
          [
            SectionSubmitted,
            SectionVote,
            CanonFire
          ],
        ],
    }
  }

  get topicHandlers() {
    const [SectionSubmitted] = canonContract.filters.SectionSubmitted().topics
    const [SectionVote] = canonContract.filters.SectionVote().topics
    const [CanonFire] = canonContract.filters.CanonFire().topics
    return {
      [SectionSubmitted]: this.sectionSubmitted.bind(this),
      [SectionVote]: this.sectionVote.bind(this),
      [CanonFire]: this.canonFire.bind(this),
      ...super.topicHandlers,
    }
  }

/**
 * event handlers
 **/

  async sectionSubmitted(event, db) {
    const epochKey = BigInt(event.topics[1]).toString()
    const epoch = BigInt(event.topics[2])
    const contentHash = BigInt(event.topics[3]).toString()
    const decodedData = canonContract.interface.decodeEventLog(
      'SectionSubmitted',
      event.data
    )
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

  async sectionVote(event, db) {
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

  async canonFire(event, db) {
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
