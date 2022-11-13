import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'
import { SERVER } from '../config'

const oldStartCanon = {
  epoch: -1,
  sectionId: "58505094002059641228530239538979228208743918597118238229492",
  voteCount: 2
}

const oldStartSection = {
  epoch: -1,
  content: "ima so sad. There is a bug in the unirep 2.0.0-alpha-0 contracts that caused the last version of canon party to be halted. It's possible to fix in the offchain logic, but non-trivial 😭. I'll probably add a link to the last canon somewhere on this page so we don't lose it completely. In the meantime i have some good nonsense to write in the next epoch.",
  graffiti: "not so canonical after all 🤡",
  contentHash: "20890416539391837845890652524857142009900509053626025208535930072988698156719",
  graffitiHash: "51590391895861833464183940568971103197886886359616928563181918475343093902416",
  id: "58505094002059641228530239538979228208743918597118238229492",
  author: "51539986299726082211099265979",
  confirmed: 1,
  voteCount: 2,
  isEditorial: true
}

class Canon {

  hasSignedUp = false
  canon = []
  sections = []
  sectionsById = {}

  constructor() {
    makeAutoObservable(this)
    this.load()
  }

  async load() {
    this.ingestSections([oldStartSection])
    await Promise.all([
      this.loadCanon(),
      this.loadSections()
    ])
    setInterval(() => {
      this.loadCanon()
      this.loadSections()
    }, 10000)
  }

  async loadCanon() {
    const data = await fetch(`${SERVER}/api/canon`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    }).then(r => r.json())
    this.canon = [oldStartCanon, ...data.items]
    this.ingestSections(data.sections)
  }

  async loadSections() {
    const data = await fetch(`${SERVER}/api/section`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    }).then(r => r.json())
    this.sections = data.items
    this.ingestSections(data.items)
  }

  async ingestSections(sections) {
    for (const section of sections) {
      const { id } = section
      this.sectionsById = { ...this.sectionsById, [id]: section }
    }
  }

}

export const canon = new Canon()
export default createContext(canon)
