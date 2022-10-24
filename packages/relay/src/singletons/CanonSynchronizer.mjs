import { Synchronizer } from '@unirep/core'
import { ethers } from 'ethers'
import { provider, UNIREP_ADDRESS, CANON_ADDRESS, PRIVATE_KEY } from '../config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import { defaultProver } from '@unirep/circuits/provers/defaultProver.js'
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
    return {
        address: CANON_ADDRESS,
        topics: [
          [
            SectionSubmitted
          ],
        ],
    }
  }

  get topicHandlers() {
    const [SectionSubmitted] = canonContract.filters.SectionSubmitted().topics
    return {
      [SectionSubmitted]: this.sectionSubmitted.bind(this),
      ...super.topicHandlers,
    }
  }

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
}

const db = await SQLiteConnector.create(schema, ':memory:')
export default new CanonSynchronizer({
  db,
  provider,
  unirepAddress: UNIREP_ADDRESS,
  attesterId: CANON_ADDRESS,
  prover: defaultProver,
})
